$(document).ready(function(){
    $('.delete-object').on('click', function(e){
      $target = $(e.target);
      const id = $target.attr('data-id');
      $.ajax({
        type:'DELETE',
        url: '/users/'+id,
        success: function(response){
          alert('Deleting User');
          window.location.href='/users/edit';
        },
        error: function(err){
          console.log(err);
        }
      });
    });
  });