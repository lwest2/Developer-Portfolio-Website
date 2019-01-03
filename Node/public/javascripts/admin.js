$(document).ready(function(event) {
  $('#clearAddBlog').on('click', function(event) {
    $('#addBlogForm')[0].reset();
    event.preventDefault();
  });
  $('#clearAddItem').on('click', function(event) {
    $('#addItemForm')[0].reset();
    event.preventDefault();
  });
  $('#clearEditItem').on('click', function(event) {
    $('#editItemForm')[0].reset();
    event.preventDefault();
  });
  $('#clearEditBlog').on('click', function(event) {
    $('#editBlogForm')[0].reset();
    event.preventDefault();
  });

  populateData();

  $('#selectitem3').change(function() {
    populateData();
  });

  $('#fetchUsers').on('click', function(event) {
    event.preventDefault();
    populateUsers();
  });
});

function populateData() {
  $.ajax({
    type: 'POST',
    url: '/admin/getblog',
    data: {
      blogtitle: $('#selectitem3').val()
    },
    success: function(data) {
      console.log("Success");
      // title3
      // content3
      // datapicker3
      $('#Title3').val(data.title);
      $('#Content3').val(data.content);
      $('#datepicker3').val(data.date);
    },
    error: function() {
      console.log("No data");
    }
  });
}

function populateUsers() {

}