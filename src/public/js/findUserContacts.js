function callFindUsers(e) {
    if(e.which === 13 || e.type === "click") {
        let keyword = $("#input-find-users-contact").val();

        const regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

        if(!keyword.length) {
            alertify.notify("Bạn chưa điền vào ô search", "error", 7);
            return false;
        }

        if(!regexKeyword.test(keyword)) {
            alertify.notify("Từ khóa không hợp lệ", "error", 7)
            return false;
        }

        $.get(`/contact/find-users/${keyword}`, function (data) {
            $("#find-user ul").html(data);
            addContact();
            removeRequestContactSent();
        });
    }
}

$(document).ready(function() {
    $("#input-find-users-contact").bind("keypress", callFindUsers)

    $("#btn-find-users-contact").bind("click", callFindUsers)
});