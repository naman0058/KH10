let categories = []

let table = '/admin/pannel/requested-payment'

$.getJSON(`${table}/all`, data => {
    categories = data
    makeTable(data)
    
  


})

function makeTable(categories){
      let table = ` <div class="table-responsive">

      
<table id="report-table" class="table table-bordered table-striped mb-0">
<thead>
<tr>
<th>Number</th>
<th>Amount</th>
<th>Date</th>
</tr>
</thead>
<tbody>`

$.each(categories,(i,item)=>{
table+=`<tr>

<td>${item.number}</td>
<td>${item.amount}</td>
<td>${item.date}</td>
<td>
<a href="#!" class="btn btn-info btn-sm send" id="${item.id}" amount = "${item.amount}" number="${item.number}"><i class="feather icon-edit"></i>&nbsp;Send Amount </a>

</td>
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
    let extra1 = (amount)/10;
    let extra = (+amount) + (+extra1)
  
$.post('/admin/pannel/requested-payment/send-amount',{id,extra,number},data=>{
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


