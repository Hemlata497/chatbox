let promt=document.querySelector("#promt");
let chatContainer=document.querySelector(".chat-container");
let imagebtn=document.querySelector("#image");
let image=document.querySelector("#image img");
let imageinput = document.querySelector("#image input")



const Api_url="your api key"



let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}




async function gernerateResponse(aiChatBox) {

let text=aiChatBox.querySelector(".ai-chat-area")
    let requestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            
                "contents": [{
                  "parts":[{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])]
                  }]
                 
        })
    }
    try{
         let response= await fetch(Api_url,requestOption)
         let data=await response.json()
         let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
         text.innerHTML=apiResponse
}
catch(error){
    console.log(error);
}
finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
    image.src=`img1.svg`
    image.classList.remove("choose")
    user.file={}

}
    }
   


function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(usermessage){
    user.message=usermessage
    let html=`<img src="user.png" alt="user" id="userimage" width="8%">
            <div class="user-chat-area">${user.message}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`:""}
            </div>`
            promt.value=""
            let userChatBox=createChatBox(html,"user-chat-box")
            chatContainer.appendChild(userChatBox)

            chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

            setTimeout(()=>{
            let html=`<img src="ai.jpg" alt="ai" id="aiimage" width="10%">
            <div class="ai-chat-area">
             <img src="load.gif" alt="load" class="load" width="20px"></div>`
            let aiChatBox= createChatBox(html,"ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            gernerateResponse(aiChatBox)
            },300)
}
promt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(promt.value)

    }
})
 
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data:base64string
        }
         image.src=`data:${user.file.mime_type};base64,${user.file.data}`
         image.classList.add("choose")
    }
   
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})