function loading(time){
    let timerInterval
    Swal.fire({
    title: 'Loading!',
    timer: time,
    timerProgressBar: false,
    onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
        const content = Swal.getContent()
        if (content) {
            const b = content.querySelector('b')
            if (b) {
            b.textContent = Swal.getTimerLeft()
            }
        }
        }, 100)
    },
    onClose: () => {
        clearInterval(timerInterval)
        const main = document.querySelector('.first');
        main.classList.add('active');
    }
    })
}