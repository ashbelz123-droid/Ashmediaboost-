async function signup(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

await fetch("/api/auth/signup",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({username,password})
});

alert("Account created");
location.href="/login.html";
}

async function login(){

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

const res = await fetch("/api/auth/login",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({username,password})
});

const data = await res.json();

if(data.success){
localStorage.setItem("user",JSON.stringify(data.user));
location.href="/dashboard.html";
}else{
alert("Login failed");
}
}

function logout(){
localStorage.clear();
location.href="/";
}
