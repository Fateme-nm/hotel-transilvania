$(document).ready(function() {
    handleHamburger()
    
    let slideNumber = 1    // slide header number
    $('.slide .slide-text.first').fadeIn(1200)      // fade in first slide
    let sliderTopInterval = setInterval(sliderTop, 5000)
    $('.carousel-button').click(function() {        // click on next or prev button
        clearInterval(sliderTopInterval)
        sliderTop($(this))
        sliderTopInterval = setInterval(sliderTop, 5000)
    })

    getComments()
    let slideCmNumber = 1  // slide comments number
    let sliderCmInterval = setInterval(sliderComments, 5000)
    $('.buttons-comments > div').click(function() { // click on next or prev button
       $('.slide-text').eq(slideNumber).css({top: '100%'})
        clearInterval(sliderCmInterval)
        sliderComments($(this))
        sliderCmInterval = setInterval(sliderComments, 5000)
    })

    $('.dateForm').submit(function(e) {             // submit date in, date out and number of room
        e.preventDefault()
        getDateInfo() 
    })

    $('.animate').mouseenter(function() {        // handle animate underline
        let c = $(this).hasClass('sub-link') ? 'sub-underline' : 'underline'
        $(this).children('div').addClass(c).animate({width: '100%'}, 200)
    })
    $('.animate').mouseleave(function() {
        $(this).children('div').stop()
        let c = $(this).hasClass('sub-link') ? 'sub-underline' : 'underline'
        $(`.${c}`).animate({width: '0'}, 200, () => $(this).removeClass(c))
    })

    function handleHamburger() {
        $('.hamburger .ham-btn').click(function() {     // open and close ham list handel
            $('.lines').toggleClass('close')
            $('.ham-btn, .book-link, .hamburger-list, .left-for-menu').toggleClass('active')
        })
        let menu = setInterval(()=> {                   // set value for hamburger label
            let labelMenu = $('body').innerWidth() <= 990 ? 'MENU' : 'EXTRA'
            $('.hamburger').children('.ham-btn').children('span').text(labelMenu)
            if (labelMenu === 'MENU') {                 // show and hide nav-linke in ham
                $('.first-ul, .first-border').css({display: 'block'})
            }
            else {
                $('.first-ul, .first-border').css({display: 'none'})
            }
        })
    }

    function sliderTop(button = false) {
        const size = $('.slide').eq(0).innerWidth()
        if (slideNumber > 0 && slideNumber < $('.slide').length - 1) {
            if (button === false || button.hasClass('next')) slideNumber ++//inte.. or next
            else slideNumber -- //prev
            $('.carousel-slide').css({transition: 'transform 0.4s ease-out'})
            $('.carousel-slide').css({transform: `translateX(${-size * slideNumber}px)`})
        }
        $('.carousel-slide').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            if ($('.slide').eq(slideNumber).hasClass('lastClone') || $('.slide').eq(slideNumber).hasClass('firstClone')) {
                $('.carousel-slide').css({transition: 'none'})
                slideNumber = $('.slide').eq(slideNumber).hasClass('lastClone') ? 
                    $('.slide').length - 2 : $('.slide').length - slideNumber
                $('.carousel-slide').css({transform: `translateX(${-size * slideNumber}px)`})
            }
        })
        $('.slide-text').css({top: '100%'})
        $('.slide-text.first').css({top: '32%'}).fadeOut(1200)
        if (slideNumber === $('.slide').length - 1 || slideNumber === 1) {// fClone for next,orginal for prev 
            $('.slide-text.first').fadeIn(1200)
        }
        else {
            let index = slideNumber === 0 ? $('.slide').length - 2 : slideNumber
            $('.slide-text').eq(index).animate({top: '32%'}, 1500)
        }
    }

    function getComments() {
        $.ajax({
            type: "GET",
            url:"./assets/json/comments.json",
            success: (result) => {
                let firstClone = null
                result.forEach((item, index) => {
                    let newLi = `<li class="slide-comment">
                        <img src=${item.img} alt="comment">
                        <div class="slide-text-comment">
                            <h4 class="title-comment">${item.title}</h4>
                            <p class="text-comment">${item.text}</p>
                            <div class="name-comment">
                                <span>${item.name}</span>
                                <span>${item.job}</span>
                            </div>
                        </div>
                    </li>`
                    $('.carousel-slide-comments').append(newLi)
                    if (index == 0) firstClone = newLi
                    else if (index == result.length - 1) {
                        $('.carousel-slide-comments').prepend(newLi)
                    }
                })
                $('.carousel-slide-comments').append(firstClone)
            },
            error: (err) => console.log(err)
        })
    }

    function sliderComments(button = false) {
        const size = $('.slide-comment').eq(0).innerWidth()
        if (slideCmNumber > 0 && slideCmNumber < $('.slide-comment').length - 1) {
            if (button === false) slideCmNumber ++ //interval
            else { //click buttons
                //$('.carousel-slide-comments').css({transition: 'none'})
                slideCmNumber = button.attr('class')
            }
            $('.carousel-slide-comments').css({transition: 'transform 0.3s ease-in-out'})
            $('.carousel-slide-comments').css({transform: `translateX(${-size * slideCmNumber}px)`})
        }
        $('.carousel-slide-comments').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            if (slideCmNumber == 0 || slideCmNumber == $('.slide-comment').length - 1) {
                $('.carousel-slide-comments').css({transition: 'none'})
                slideCmNumber = $('.slide-comment').eq(slideCmNumber).index() == 0 ? 
                    $('.slide-comment').length - 2 : $('.slide-comment').length - slideCmNumber
                $('.carousel-slide-comments').css({transform: `translateX(${-size * slideCmNumber}px)`})
            }
        })
        $('.buttons-comments > div').css({background: '#d6d6d6'})
        let index = slideCmNumber < $('.slide-comment').length - 1 ? slideCmNumber - 1 : 0
        $('.buttons-comments > div').eq(index).css({background: '#869791'})
    }

    function getDateInfo() {
        const selected_inDate = new Date($('.inDate input').val()).getTime()
        const selected_outDate = new Date($('.outDate input').val()).getTime()
        const selected_rooms = $('.numberRoom input').val()
        $.ajax({
            type: "GET",
            url:"./assets/json/rooms.json",
            success: (result) => {
                result.forEach(item => {
                    const item_inDate = new Date(item.from).getTime()
                    const item_outDate = new Date(item.to).getTime()
                    let newClass = ''
                    if (selected_outDate > selected_inDate && selected_inDate >= item_inDate && selected_outDate <= item_outDate
                        && selected_rooms == item.bed){
                        newClass = 'class=allowed'
                    }
                    let newTr = `<tr ${newClass}>
                        <td>${item.from}</td>
                        <td>${item.to}</td>
                        <td>${item.room}</td>
                        <td>${item.bed}</td>
                    </tr>`
                    $('.tBody').append(newTr)
                })
                $('body').css({'overflow-y': 'hidden', 'background-color': 'rgba(0,0,0,0.4)'})
                $('section.modal').css({'display': 'block'})
                $('body').click(function() {
                    $('body').css({'overflow-y': 'scroll', 'background-color': '#f4f4f4'})
                    $('section.modal').css({'display': 'none'})
                    $('.tBody').empty()
                })
            },
            error: (err) => console.log(err)
        })
    }

})

let SlideNumber_room = 1
let sliderRoomInterval = setInterval(sliderRoom, 5000)
const btnRoom = document.querySelector('.buttons-rooms')
btnRoom.addEventListener('click', (event) => {  // click on circle button 
    clearInterval(sliderRoomInterval)
    sliderRoom(event)
    sliderRoomInterval = setInterval(sliderRoom, 5000)
})

function sliderRoom(e) {
    const slides = document.querySelectorAll('.slide-room')
    const slidesContainer = document.querySelector('.carousel-slide-rooms')
    const btnRooms = document.querySelectorAll('.buttons-rooms > div')
    const size = slides[0].clientWidth
    if (SlideNumber_room > 0 && SlideNumber_room < slides.length - 1) {
        if (e === undefined) SlideNumber_room ++ // interval
        else { // click buttons
            //slidesContainer.style.transition = 'none'
            SlideNumber_room = +e.target.className
        }
        slidesContainer.style.transition = 'transform 0.3s ease-in-out'
        slidesContainer.style.transform = `translateX(${-size * SlideNumber_room}px)`
    }
    slidesContainer.addEventListener('transitionend', () => {
        if (SlideNumber_room == 0 || SlideNumber_room == slides.length - 1) {
            slidesContainer.style.transition = 'none'
            SlideNumber_room = slides[SlideNumber_room].classList.contains('lastClone-room') ? slides.length - 2 : slides.length - SlideNumber_room
            slidesContainer.style.transform = `translateX(${-size * SlideNumber_room}px)`
        }
    })
    btnRooms.forEach(btn => btn.style.backgroundColor = '#f4f4f4')
    let index = SlideNumber_room < slides.length - 1 ? SlideNumber_room - 1 : 0
    btnRooms[index].style.backgroundColor = '#869791'
}

mybutton = document.querySelector('#goToTop')   // go to top button
window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "flex";
    } else {
        mybutton.style.display = "none";
    }
}
mybutton.addEventListener('click', () => {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
})
