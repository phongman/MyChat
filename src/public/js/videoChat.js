function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text();

        let dataToEmit = {
            listenerId: targetId,
            callerName: callerName
        }

        console.log(dataToEmit);
        // step 01: caller - check user online
        socket.emit("caller-check-listener-online", dataToEmit)
    })
}

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function() {
    video.play();
  }
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function() {
    // step 02: caller - user is offline
    socket.on("server-sent-listener-is-offline", function() {
        alertify.notify("user is not online", "error", 7);
    })

    let iceServerList =  $("#ice-server-list").val();

    let getPeerId = "";
    const peer = new Peer({
      key: "peerjs",
      host: "phong-peerjs-server.herokuapp.com",
      secure: true,
      port: 443,
      debug: 3, 
      config: {"iceServers": JSON.parse(iceServerList)}
    });
    peer.on("open", function(peerId) {
        getPeerId = peerId
    })

    // step 03: listener - create peerId
    socket.on("server-request-peerId-of-listener", function(response) {
        let listenerName = $("#navbar-username").text();

        let dataToEmit = {
            callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: listenerName,
          listenerPeerId: getPeerId,
        }

        // step 04: listener - sent peerid to socket
        socket.emit("listener-emit-peerId-to-server", dataToEmit);
    })

    // step 05: caller - receive peerid from socket 
    socket.on("server-sent-peerId-of-listener-to-caller", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: response.listenerName,
          listenerPeerId: response.listenerPeerId,
        }

        //step 06: caller - request to call to listener
        socket.emit("call-request-to-call-to-server", dataToEmit);

        let timerInterval
        Swal.fire({
          title: `Calling &nbsp; <span style="color: #2ecc71">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
          html: `Time: <strong style="color: #d43f3a"></strong> seconds 
            </br>
            </br>
            <button id="btn-cancel-call" class="btn btn-danger">
                Cancel
            </button>
          `,
          backdrop: "rgba(85, 85 , 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          timer: 30000,
          onBeforeOpen: () => {
              $("#btn-cancel-call").unbind("click").on("click", function() {
                Swal.close();
                clearInterval(timerInterval);

                // step 07: caller - cancel call request
                socket.emit("caller-cancel-request-call-to-server", dataToEmit);
              })
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
            }, 1000)
          },
          onOpen: () => {
              // step 12: caller - recevive reject call from socket
              socket.on("server-sent-reject-call-to-caller", function(response) {
                Swal.close();
                clearInterval(timerInterval);

                Swal.fire({
                    type: "info",
                    title: `<span style="color: #2ecc71">${response.listenerName}</span> &nbsp; is busy`,
                    backdrop: "rgba(85, 85 , 85, 0.4)",
                    width: "52rem",
                    allowOutsideClick: false,
                    confirmButtonColor: "#2ecc71",
                    confirmButtonText: "ok",
                });
              });

              //step 13: caller - receive accept call from socket
              socket.on("server-sent-accept-call-to-caller", function(response) {
                Swal.close();
                clearInterval(timerInterval);

                let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
              
                getUserMedia({video: true, audio: true}, function(stream) {
                  // show modal stream
                  $("#streamModal").modal("show");

                  // play my stream in local
                  playVideoStream("local-stream", stream);

                  // call to listener
                  let call = peer.call(response.listenerPeerId, stream);

                  // listen and play listener stream
                  call.on('stream', function(remoteStream) {
                    // Show stream in some video/canvas element.
                    playVideoStream("remote-stream", remoteStream);

                    $("#streamModal").on("hidden.bs.modal", function() {
                      closeVideoStream(stream);
                    });
                  });
                }, function(err) {
                  console.log('Failed to get local stream' ,err);
                });
              });
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          return false;
        })
    })

    // step 08: listener - receive call from socket;
    socket.on("server-sent-request-call-to-listener", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: response.listenerName,
          listenerPeerId: response.listenerPeerId,
        }

        let timerInterval
        Swal.fire({
          title: `<span style="color: #2ecc71">${response.callerName}</span> &nbsp; is calling <i class="fa fa-volume-control-phone"></i>`,
          html: `Time: <strong style="color: #d43f3a"></strong> seconds 
            </br>
            </br>
            <button id="btn-reject-call" class="btn btn-danger">
                Cancel
            </button>
            <button id="btn-accept-call" class="btn btn-success">
                Accept
            </button>
          `,
          backdrop: "rgba(85, 85 , 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          timer: 30000,
          onBeforeOpen: () => {
              $("#btn-reject-call").unbind("click").on("click", function() {
                Swal.close();
                clearInterval(timerInterval);

                // step 10: listener - emit reject call to server 
                socket.emit("listener-reject-request-call-to-server", dataToEmit);
              })

              $("#btn-accept-call").unbind("click").on("click", function() {
                // Swal.close();
                // clearInterval(timerInterval);

                // step 11: listener - emit accpet call to server 
                socket.emit("listener-accept-request-call-to-server", dataToEmit);
              })
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/1000);
            }, 1000)
          },
          onOpen: () => {
            // step 09: listener - receive cancel call from socket;
            socket.on("server-sent-cancel-request-call-to-listener", function(response) {
                Swal.close();
                clearInterval(timerInterval);   
            })

            //step 14: listener - listener accept call from socket
            socket.on("server-sent-accept-call-to-listener", function(response) {
                Swal.close();
                clearInterval(timerInterval);

                let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

                peer.on('call', function(call) {
                  getUserMedia({video: true, audio: true}, function(stream) {
                      // show modal stream
                    $("#streamModal").modal("show");

                    // play my stream in local
                    playVideoStream("local-stream", stream);

                    call.answer(stream); // Answer the call with an A/V stream.
                    call.on('stream', function(remoteStream) {
                      // Show stream in some video/canvas element.
                      playVideoStream("remote-stream", remoteStream);
                    });

                    // close modal: remove stream
                    $("#streamModal").on("hidden.bs.modal", function() {
                      closeVideoStream(stream);
                    });
                  }, function(err) {
                    console.log('Failed to get local stream' ,err);
                  });
                });
           });
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          return false;
        })
    })
})