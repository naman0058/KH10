let categories = []

let table = 'admin/pannel/users'

$.getJSON(`/${table}/all`, data => {
    categories = data
    makeTable(data)
    
})

function makeTable(categories){
      let table = ` <div class="table-responsive">

      
<table id="report-table" class="table table-bordered table-striped mb-0">
<thead>
<tr>
<th>Number</th>
<th>Name</th>

<th>Address</th>
<th>Wallet</th>
<th>Date</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>
<td><a href='/admin/pannel/users/details?number=${item.number}'>${item.number}</a></td>
<td>${item.name}</td>

<td>${item.address}</td>
<td>${item.wallet}</td>
<td>${item.todayDate}</td>

</tr>`
})
table+=`</tbody>
</table>
</div>

    
  <!-- End Row -->`
      $('#result').html(table)
      $('#insertdiv').hide()
      $('#result').show()
}





$('#result').on('click', '.send', function() {
    const id = $(this).attr('id')
    const amount = $(this).attr('amount')
    const number = $(this).attr('number')
    let extra = (amount)/10;
  
$.post('/requested-payment/send-amount',{id,extra,number},data=>{
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
     $('#pname').val(result.name)
   
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


