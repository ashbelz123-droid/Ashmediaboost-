async function signup(){
    await fetch("/api/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:username.value,
            password:password.value
        })
    });
    alert("Account created");
}

async function login(){
    const res = await fetch("/api/auth/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            username:username.value,
            password:password.value
        })
    });
    const data = await res.json();
    if(data.success){
        localStorage.setItem("userId",data.user._id);
        location.href="dashboard.html";
    }else{
        alert("Invalid login");
    }
}

async function createOrder(box,price){
    const userId = localStorage.getItem("userId");

    await fetch("/api/orders/create",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId,box,price})
    });

    alert("Order Created");
                             }
