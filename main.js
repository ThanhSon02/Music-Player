const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'USER_1'

const play = $('.player')
const playlist = $('.play-list')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('.progress')
const preBtn = $('.btn-pre')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
        {
            name: '8 Letters',
            singer: 'Why Dont We',
            path: './assets/music/8Letters_WhyDontWe.mp3',
            image: './assets/img/8letters.jpg'
        },
        {
            name: 'Heroes',
            singer: 'Alesso',
            path: './assets/music/Alesso_HeroeswecouldbeftToveLo.mp3',
            image: './assets/img/Heroes.jpg'
        },
        {
            name: 'Outside',
            singer: 'Calvin Harris ft Ellie Goulding',
            path: './assets/music/CalvinHarris_OutsideftEllieGoulding.mp3',
            image: './assets/img/outside.jpg'
        },
        {
            name: 'Titanium',
            singer: 'David Guetta ft Sia',
            path: './assets/music/DavidGuetta_TitaniumftSia.mp3',
            image: './assets/img/Titanium.jpg'
        },
        {
            name: 'Shark',
            singer: 'Imagine Dragons',
            path: './assets/music/ImagineDragons_Sharks.mp3',
            image: './assets/img/Sharks.jpg'
        },
        {
            name: 'Ill Be There',
            singer: 'Jess Glynne',
            path: './assets/music/JessGlynne_IllBeThere.mp3',
            image: './assets/img/Ill_be_there.jpg'
        },
        {
            name: 'Numb',
            singer: 'Marshmello, Khalid',
            path: './assets/music/MarshmelloKhalid_Numb.mp3',
            image: './assets/img/Numb.jpg'
        },
        {
            name: 'Dandelions',
            singer: 'Ruth B',
            path: './assets/music/RuthB_Dandelions.mp3',
            image: './assets/img/Dandelions.jpg'
        },
        {
            name: 'Chlorine',
            singer: 'twenty one pilots',
            path: './assets/music/twentyonepilots_Chlorine.mp3',
            image: './assets/img/Chlorine.jpg'
        },
        {
            name: 'My Blood',
            singer: 'twenty one pilots',
            path: './assets/music/twentyonepilots_MyBlood.mp3',
            image: './assets/img/Myblood.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="play-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');"></div>
                <div class="play-body">
                    <h2 class="play-name">${song.name}</h2>
                    <p class="play-singer">${song.singer}</p>
                </div>
                <div class="play-option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
        `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        const _this = this

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'},
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
            cd.style.opacity = newcdWidth / cdWidth
        }

        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            play.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            play.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function() {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }

        progress.oninput = function() {
            const seekTime = progress.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        preBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            }else {
                _this.preSong()
            }
            audio.play()
            _this.render()
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.play-item:not(.active)')
            if(songNode || e.target.closest('.play-option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                // When click on Option
                if(e.target.closest('.play-option')) {

                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    preSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandom: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()

        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()