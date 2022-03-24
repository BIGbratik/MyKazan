
async function accessCtrl()
{

    var accKey=document.getElementById("Key").value;

    let response = await fetch(`https://localhost:5001/auth/`,
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(accKey)
    });

    if (response.ok)
    {
        let res=await response.json();
        if (res==0)
        {
            alert("Введённый ключ не действителен!!!");
        }
        else if (res==1)
        {
            document.getElementById('functional-container').style.display='block';
            document.getElementById('input-container').style.display='none';
        }
    }
    else
    {
        let response = await fetch(`https://localhost:25001/auth/`,
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(accKey)
        });
    
        if (response.ok)
        {
            let res=await response.json();
            if (res==0)
            {
                alert("Введённый ключ не действителен!!!");
            }
            else if (res==1)
            {
                document.getElementById('functional-container').style.display='block';
                document.getElementById('input-container').style.display='none';
            }
        }
        else
        {
            alert("Не удалось установить соединение с сервером аутентификации!!!");
        }
    }


}
