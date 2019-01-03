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

  populateBlog();
  populatePortfolio();
  populateUsers();

  $('#selectitem3').change(function() {
    populateBlog();
  });

  $('#selectitem2').change(function() {
    populatePortfolio();
  });

  $('#fetchUsers').on('click', function(event) {
    event.preventDefault();
    populateUsers();
  });

  $('#removeUsers').on('click', function(event) {
    event.preventDefault();
    removeUsers();
  });

  $('#banUsers').on('click', function(event) {
    event.preventDefault();
    banUsers();
  })
});

function populateBlog() {
  $.ajax({
    type: 'POST',
    url: '/admin/getblog',
    data: {
      blogtitle: $('#selectitem3').val()
    },
    success: function(data) {
      if (data != null) {
        console.log("Success");

        $('#Title3').val(data.title);
        $('#Content3').val(data.content);
        $('#datepicker3').val(data.date);
      }
    },
    error: function() {
      console.log("No data");
    }
  });
}

function populatePortfolio() {
  $.ajax({
    type: 'POST',
    url: '/admin/getitem',
    data: {
      itemtitle: $('#selectitem2').val()
    },
    success: function(data) {
      if (data != null) {
        console.log("Success");

        $('#Title2').val(data.title);
        $('#Content2').val(data.content);
        $('#datepicker2').val(data.date);
      }
    },
    error: function() {
      console.log("No data");
    }
  });
}

function populateUsers() {
  $.ajax({
    type: 'POST',
    url: '/admin/getusers',
    success: function(data) {
      if (data != null) {
        console.log("Success");
        // for each docs set options
        $('#userList').children('option').remove();
        for (var i = 0; i < data.length; i++) {
          $('#userList').append("<option>" + data[i].email + "</option>");
        }
      }
    },
    error: function() {
      console.log("No data");
    }
  });
}

function removeUsers() {
  var arraySelected = [];
  $('#userList :selected').each(function() {
    arraySelected.push($(this).val());
  });
  console.log(arraySelected);
  $.ajax({
    type: 'POST',
    url: '/admin/removeusers',
    data: {
      userlist: JSON.stringify(arraySelected)
    },
    success: function(data) {
      console.log(data);
      populateUsers();
    },
    error: function() {
      console.log("No data");
    }
  });
}

function banUsers() {
  var arraySelected = [];
  $('#userList :selected').each(function() {
    arraySelected.push($(this).val());
  });
  console.log(arraySelected);
  $.ajax({
    type: 'POST',
    url: '/admin/banusers',
    data: {
      userlist: JSON.stringify(arraySelected)
    },
    success: function(data) {
      console.log(data);
      removeUsers();
      populateUsers();
    },
    error: function() {
      console.log("No data");
    }
  });
}