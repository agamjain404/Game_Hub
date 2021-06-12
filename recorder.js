const start = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia(
        {
            video:{
                mediaSource: "screen",
            },
        }
    )

    const data  = [];

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
        data.push(e.data);
    }

    mediaRecorder.onstop = (e) => {
        console.log("Agam Jain");
        const blob = new Blob(data, { type: 'video/mp4'});
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.download = "file.mp4";
        a.href = url;
        a.click();
        data = [];
    }
}

document.querySelector('.btn').addEventListener("click",function(){
    start();
})