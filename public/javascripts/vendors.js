let categories = []

let table = '/admin/pannel/vendors'

$('#show').click(function(){
  
$.getJSON(`${table}/all`, data => {
    categories = data
    makeTable(data)
    
  
})

})

function makeTable(categories){
      let table = ` <div class="table-responsive">

      <button type="button" id="back" class="btn btn-primary" style="margin:20px">BacK</button>
<table id="report-table" class="table table-bordered table-striped mb-0">
<thead>
<tr>
<th>Store Number</th>
<th>Image</th>
<th>Name</th>
<th>Number</th>
<th>Address</th>
<th>Options</th>

</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td><a href='/admin/pannel/vendors/details?number=${item.number}'>${item.store_number}</a></td>
<td>
<img src="/images/${item.image}" class="img-fluid img-radius wid-40" alt="" style="width:50px;height:50px">
</td>
<td><a href='/admin/pannel/vendors/details?number=${item.number}'>${item.name}</a></td>
<td>${item.number}</td>
<td>${item.address}</td>
<td>
<a href="#!" class="btn btn-info btn-sm edits" id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit </a>
<a href="#!" class="btn btn-info btn-sm updateimage"  id="${item.id}"><i class="feather icon-edit"></i>&nbsp;Edit Image </a>
<a href="#!" class="btn btn-danger btn-sm deleted" id="${item.id}"><i class="feather icon-trash-2"></i>&nbsp;Delete </a>
</td>`
// if(item.wallet == 0 ){
//     table+= `<td>
//     <a href="#!" class="btn btn-warning btn-sm warning" >&nbsp;No Amount </a>
//     </td>`
// }
// else{
//     table+= `<td>
//     <a href="#!" class="btn btn-success btn-sm collect" id="${item.id}" store_number = '${item.store_number}'>&nbsp;Collect Amount </a>
//     </td>`
// }


table+=`</tr>`
})
table+=`</tbody>
</table>
</div>

    
  <!-- End Row -->`
      $('#result').html(table)
      $('#insertdiv').hide()
      $('#result').show()
}


$('#result').on('click', '.deleted', function() {
    const id = $(this).attr('id')
    alert(id)
     $.get(`${table}/delete`,  { id }, data => {
        refresh()
    })
})




$('#result').on('click', '.collect', function() {
    const id = $(this).attr('id')
    const store_number = $(this).attr('store_number')
     $.get(`${table}/collect`,  { id ,store_number}, data => {
        refresh()
    })
})





$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
  
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
    $('#pstore_number').val(result.store_number)
     $('#pname').val(result.name)
     $('#pnumber').val(result.number)
     $('#paddress').val(result.address)
     $('#pemail').val(result.email)
     $('#platitude').val(result.latitude)
     $('#plongitude').val(result.longitude)
   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        number:$('#pnumber').val(),
        address:$('#paddress').val(),
        email:$('#pemail').val(),
        latitude:$('#platitude').val(),
        longitude:$('#plongitude').val()
       
        }

    $.post(`${table}/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`${table}/all`, data => makeTable(data))
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})


