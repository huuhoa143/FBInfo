function Book() {
    function bindEvent() {
        $(".book_edit").click(function (e) {
            var params = {
                id: $(".id").val(),
                bookid: $(".bookid").val(),
                bookname: $(".bookname").val(),
                bookauthor: $(".bookauthor").val()
            };

            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/book/edit",
                type: "PUT",
                data: params,
                dataType: "json",
                success: function (res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        });
        $(".book_delete").click(function (e) {
            var book_id = $(this).attr("book_id");
            var base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/book/delete",
                type: "DELETE",
                data: {id: book_id},
                dataType: "json",
                success: function (res) {
                    if(res && res.status_code == 200) {
                        location.reload();
                    }
                }
            })
        })

    }
    bindEvent();
}
$(document).ready(function () {
    new Book();
});