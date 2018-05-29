

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}





// section of the javascript
document.getElementById('barra').style.display ='none';

function start(){

    document.getElementById('plug').style.display="flex";
    document.getElementById('login').style.display = 'none';
    document.getElementById('barra').style.display ='flex';

}



// to create hasscode in javascript

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

// hashcode section ends


// Initialize your app

var myApp = new Framework7({
    clicks: {
        externalLinks: '.external',
    },

    modalUsernamePlaceholder : 'Insert your Email',
    modalPasswordPlaceholder : 'Insert your DeviceId'

});





// Export selectors engine
var $$ = Dom7;

/// experiment

// login screen section

// Add the view
var mainView = myApp.addView('.view-main', {

    // enable the dynamic navbar for this view:
    dynamicNavbar: true,
    main: true,
});

// validation of email in javascript  note  a connection server must be done too
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// registration page
$$('#create').click(function() {

 var creation = "creation";
 var name = $$('#name').val();
 var surname = $$('#surname').val();
 var email = $$('#email').val();
 var cemail= $$('#cemail').val();
 var password = $$('#password').val();
 var cpassword = $$('#cpassword').val();
 var device = $$('#deviceid').val();



 password = hashCode(password);
 cpassword = hashCode(cpassword);

if(name ===''|| surname === '' || email === '' || cemail === '' || password === '' || cpassword === '' || device === ''){

    myApp.alert('Please fill the whole form','Error!');
}
else if(validateEmail(email)== false || validateEmail(cemail)== false || email != cemail){
    myApp.alert('please confirm your email!','Error');
}

else if(password != cpassword){
    myApp.alert('please confirm your password','Error');
}


else{


    $$.ajax({url:'http://oneswitch.club/php/forms.php', data:{ 'create':creation, 'name':name, 'surname':surname, 'email':email, 'password':password, 'device':device,'cpassword':cpassword, 'cemail':cemail},
        type:'POST',success:function(feedback){
        myApp.alert(feedback,'confirmation');
        document.getElementById('myform').reset();
        myApp.loginScreen('.login-screen');

    }
    });


}
});
// registration page ends





// login page starts

$$('#sub').on('click',function (e) {
    var username = $$('#fusername').val();
    var fpassword = $$('#fpassword').val();

    fpassword = hashCode(fpassword);

    if(validateEmail(username) == false || username === '' || fpassword ===''){
        myApp.alert('please check your inputs (wrong email or empty values!)', "Error" );

    }
    else {
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader();
        }, 1500);
        $$.ajax({
            url: 'http://oneswitch.club/php/forms.php', data: {'username': username, 'fpassword': fpassword},
            dataType: 'json',
            type: 'POST', success: function (feedback) {

                if(feedback.error==='successful'){

                    document.getElementById('logoutButton').style.display='flex';
                    start();
                    iduser();
                    myApp.showTab('#view-4');
                    myApp.closeModal('.login-screen');
                    $$('#pname').val(feedback.name);
                    $$('#psurname').val(feedback.surname);
                    $$('.pemail').text(feedback.email);
                    $$('#pdeviceid').val(feedback.device);



                }
                if(feedback.error==='no'){

                  myApp.alert(' wrong attempt to login!',"Error");

                }


            },});


    }});


//login page ends
// plug view

$$('#plug').on('click',function () {
    myApp.showTab('#view-5');
    myApp.showPreloader();
    setTimeout(function () {
        myApp.hidePreloader();

    }, 1000);

    fillingPorts();
   iduser();
});

// plug view ends


//custom logout
$$('#logoutButton').on('click', function () {
    myApp.showPreloader();
    setTimeout(function () {
        myApp.hidePreloader();
    }, 1500);
    document.getElementById('myform').reset();
    document.getElementById('myform2').reset();
    document.getElementById('myform3').reset();

    location.reload();

});

//custom logout ends



$$('#recover').on('click', function () {

    myApp.modalLogin('Information required', "Password Request",function (email,deviceID) {
        var cemail = email;
        var cdevice = deviceID;
        var fake =  makeid();
        var randomPass = fake;
        var key = hashCode(randomPass);

        if(validateEmail(cemail)== true) {
            $$.ajax({
                url: 'http://oneswitch.club/php/forms.php', data: {'email':cemail,'deviceid': cdevice, 'key':randomPass, 'fake':key},
                type: 'POST', success: function (feedback) {

                   myApp.alert(feedback,'confirmation');

                }});
    }else{
            myApp.alert('please provide right credentials, Incorrect email and deviceid !!','error');
        }
    });

});





// forgotten password section ends

// profile edition starts
$$('#edit').on('click', function () {
     var name = $$('#pname').val();
     var surname = $$('#psurname').val();
     var deviceid = $$('#pdeviceid').val();
     var emailp=$$('.pemail').text();

    if(name ===''|| surname === '' || deviceid === ''){

        myApp.alert('Please fill the whole form','Error!');
    }
   else {
        $$.ajax({url:'http://oneswitch.club/php/forms.php', data:{ 'namep':name,'surnamep':surname,'devicep':deviceid, 'emailp':emailp},
            type:'POST',success:function(feedback){
                myApp.alert(feedback,'confirmation');


            }
        });
    }
});


// profile edition ends

// reset password section in profile starts

$$('#resetPassword').on('click', function () {
    var passwordR = $$('#currentPassword').val();
    var npasswordR = $$('#newPassword').val();
    var cnpasswordR = $$('#cnewPassword').val();
    var emailp=$$('.pemail').text();

    passwordR = hashCode(passwordR);
    npasswordR = hashCode(npasswordR);
    cnpasswordR = hashCode(cnpasswordR);

    if(npasswordR ===''|| cnpasswordR === '' || emailp === ''){

        myApp.alert('Please fill the whole form','Error!');
    }
    else if(npasswordR != cnpasswordR){
        myApp.alert('please check the new password is not matching ','error');
    }
    else {
        $$.ajax({url:'http://oneswitch.club/php/forms.php', data:{ 'passwordR':passwordR,'newpasswordR':npasswordR,'cnpasswordR':cnpasswordR, 'emailp':emailp},
            type:'POST',success:function(feedback){
                myApp.alert(feedback,'confirmation');
                document.getElementById('myform3').reset();
                myApp.showTab('#view-4');

            }
        });
    }
});

// reset password section in profile ends






// Add views
myApp.addView('#view-1',{
	name : 'uno',

});
myApp.addView('#view-2',{

	name : 'dos',
});

myApp.addView('#view-3',{

    name : 'tres',
});


myApp.addView('#view-4',{

    name : 'cuatro',
});

myApp.addView('#view-5',{

    name : 'cinco',
});


var user = '';
var status16;
var status19;
var status20;
var status26;




function iduser(){

	user = $$('#pdeviceid').val();



	$$.getJSON("http://oneswitch.club/serverconnection/db.php?type=check&user=" + user, function( data ) {

		status16 = data.port16;
		status19 = data.port19;
		status20 = data.port20;
		status26 = data.port26;

		fillingPorts();
		flickingPorts();

        $$('#port16').on('change', function (e) {
            if ($$('#port16').prop('checked') === true){
                status16 = 'ON';
            }
            else{
                status16 = 'OFF';
            }
            $$.get("http://oneswitch.club/serverconnection/db.php?type=change&user=" + user + "&port=16&newstatus=" + status16, function( data ) {

            });
        });


        $$('#port19').on('change', function (e) {

            if ($$('#port19').prop('checked') === true){
                status19 = 'ON';
            }
            else{
                status19 = 'OFF';
            }
            $$.get("http://oneswitch.club/serverconnection/db.php?type=change&user=" + user + "&port=19&newstatus=" + status19, function( data ) {


            });
        });

        $$('#port20').on('change', function (e) {
            if ($$('#port20').prop('checked') === true){
                status20 = 'ON';
            }
            else{
                status20 = 'OFF';
            }
            $$.get("http://oneswitch.club/serverconnection/db.php?type=change&user=" + user + "&port=20&newstatus=" + status20, function( data ) {

            });
        });
        $$('#port26').on('change', function (e) {
            if ($$('#port26').prop('checked') === true){
                status26 = 'ON';
            }
            else{
                status26 = 'OFF';
            }
            $$.get("http://oneswitch.club/serverconnection/db.php?type=change&user=" + user + "&port=26&newstatus=" + status26, function( data ) {

            });
        });





    });

}

function fillingPorts(){
	if(user == ''){
        var name = $$('#pname').val();
		document.getElementById("pleaseLogin").innerHTML = "<br><br><h2 class='alineacion'>Please "+name+" don't forget to insert your <u><b>Device I.D.</b></u> in myProfile  <br> if your are login with facebook... </h2><br>";
		$$('#ports').hide();
			
	}
	else {

	    var name = $$('#pname').val();
		document.getElementById("pleaseLogin").innerHTML ="<h2 class='alineacion'>Welcome  "+name +"</h2>";
		$$('#ports').show();
	}
	
} 

function flickingPorts( ){

	if (status16 ==='ON'){
		$$('#port16').prop('checked', true);
	}
	else{
		$$('#port16').prop('checked', false);
	}

	if (status19 === 'ON'){
		$$('#port19').prop('checked', true);
	}
	else{
		$$('#port19').prop('checked', false);
	}

	if (status20 === 'ON'){
		$$('#port20').prop('checked', true);
	}
	else{
		$$('#port20').prop('checked', false);
	}

	if (status26 === 'ON'){
		$$('#port26').prop('checked', true);
	}
	else{
		$$('#port26').prop('checked', false);
	}
}


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.


    } else {
        // The person is not logged into your app or we are unable to tell.

    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1771803889782309',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.12'
    });

    FB.AppEvents.logPageView();
    FB.getLoginStatus(function(response){

    });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function testAPI(){




    console.log('welcome fetching your information!....');
    FB.api('/me',{locale: 'tr_TR',fields:'name,email'}, function (response) {

        var facebookname =  response.name;
        var fullname  = facebookname.split(' ');

  // facebook data  section  (name, surname, email)
        console.log('sussceful login for::'+fullname[0]);
        console.log('sussceful login for::'+fullname[1]);
        console.log('sussceful login for::'+response.email);

        var name = fullname[0];
        var surname = fullname[1];
        var email = response.email;

        $$.ajax({url:'http://oneswitch.club/php/forms.php', data:{ 'facebookname':name, 'facebooksurname':surname,'facebookemail':email,'device':''},
            dataType: 'json',
            type:'POST',success:function(feedback) {


                myApp.alert(feedback.msg, 'confirmation');
                 $$('#pname').val(feedback.name);
                $$('#psurname').val(feedback.surname);
                $$('.pemail').text(feedback.email);
                $$('#pdeviceid').val(feedback.device);
                myApp.showTab('#view-4');





            }});



    });
}



function logingOut() {

    FB.logout(function (response) {
        // Person is now logged out
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader();
        }, 3000);
        document.getElementById('myform').reset();
        document.getElementById('myform2').reset();
        document.getElementById('myform3').reset();
        location.reload();
    });
}




function loginFacebook(){

    FB.login(function(response) {

        if(response.status === "unknown") {

            console.log('login from facebook cancelled');

        }else {
           start();
            myApp.closeModal('.login-screen');
            myApp.showTab('#view-4');
            iduser();
            document.getElementById('logoutButton').style.display = 'flex';
            console.log(response);
            testAPI();

            myApp.showPreloader();
            setTimeout(function () {
                myApp.hidePreloader();

            }, 1000);
            $$('#logoutButton').on('click',function(e){
               logingOut();

            });

        }

    }, {scope: 'email'});
}



