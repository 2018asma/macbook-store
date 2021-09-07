$(function(){

    $('.alert').hide()

    $('form').submit((e)=>{
        e.preventDefault()
        console.log('Form Submited !')

        $('input').val('')
        $('select').prop('selectedIndex',0)
        $('.alert').fadeIn()

    setTimeout(()=>$('.alert').fadeOut(),2000)


        
    })
})