/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login with');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

function loginUser(){
    email = $('#emailLogin').val()
    pass = $('#passwordLogin').val()
    if(email === "" || pass === ""){
        console.log("pass err")
        shakeModal()
        return 403; 
    }
    var url = "http://127.0.0.1:9000/loginUser"
    params ={"username":email, "password":pass}
    config = { headers: {'Content-Type': 'application/json'} };
    axios.post(url, params, config).then(res => { 
        if(res.status === 200){
            console.log("OK")}
    }).catch(error => {
        shakeModal()
    })
}

function registerUser(){
    email = $('#emailRegister').val()
    pass = $('#passwordRegister').val()
    confirm = $('#passwordRegisterConfirm').val()
    if(pass !== confirm || email === "" || pass === ""){
        console.log("pass err")
        shakeModal()
        return 403; 
    }
    var url = "http://127.0.0.1:9000/registerUser"
    params ={"username":email, "password":pass}
    const config = { headers: {'Content-Type': 'application/json'} };

    axios.post(url, params, config).then(res => { 
        if(res.status === 200){
            console.log("OK")
        }else{
            shakeModal();
        }
    }).catch(error => {
        console.log('error', error);
    })
}

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid data");
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}

   