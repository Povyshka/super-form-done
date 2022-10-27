let name = document.querySelector('#name'),
    secondName = document.querySelector('#secondName'),
    email = document.querySelector("#email"),
    btn = document.querySelector('.btn'),
    users = document.querySelector('.users'),
    clear = document.querySelector('.clear'),
    number = document.querySelector('#number'),
    oldKey = ''


// Объект для localStorage
let storage = JSON.parse(localStorage.getItem('users')) || {}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length || mutation.removedNodes.length) {
            console.log("Карта USERS обновилась")
            setListeners()
        }
    })
})

observer.observe(users, {
    childList: true
})

btn.addEventListener('click', getData)
clear.addEventListener('click', clearLocalStorage)

function getData(e) {
    e.preventDefault()
    const data = {}

    data.name = name.value || ''
    data.secondName = secondName.value || ''
    data.email = email.value || ''
    data.number = number.value || ''

    const key = data.email //create key - email from input
    storage[key] = data  // storage[email@site.com] = data{info}

    //смотрим - не совпадает ли новый инпут мейла со старым значением 
    if (key !== oldKey || key === '') {
        delete storage[oldKey]; //если это совсем новый ключ или изменили мейл - удалеям старую инфу по старому ключу
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(storage)); //и записываем новую информацию по новому ключу 
    }
    localStorage.setItem('users', JSON.stringify(storage)) // если эмейл тот же - добавляем новую инфу в сторадж с предыдущим емейлом, новая карточка не создается 

    rerenderCard(JSON.parse(localStorage.getItem('users')))

    //возвращаем обьект дата data: {name: any;} 

    name.value = '';
    secondName.value = '';
    email.value = '';
    number.value = '';
    oldKey = '';

    return data
}

function createCard({ name, secondName, email, number }) {
    return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${email}</p>
                <p>${number}</p>
            </div>
            <div class="menu">
                <button data-change=${email} class="change">Изменить</button>
                <button data-delete=${email} class="delete">Удалить</button>
            </div>
        </div>
    `
}

function rerenderCard(storage) {
    users.innerHTML = ''

    /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

    /*
    Object.entries переводит объект в массив
    Object.entries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

    Object.entries(storage).forEach(user => {
        // user = ['email1', {name: '', secondName: '', email: ''}]
        const [email, userData] = user
        console.log("USER  === ", user)
        console.log("EMAIL === ", email)
        console.log("DATA  === ", userData)

        const div = document.createElement('div')
        div.className = 'user'
        div.innerHTML = createCard(userData)
        users.append(div)
    })
}

function setListeners() {
    const del = document.querySelectorAll('.delete')
    const change = document.querySelectorAll('.change')
    let clicked
    let key

    del.forEach(n => {
        n.addEventListener('click', () => {
            console.log('УДАЛИТЬ кнопка')
            console.log("=== NODE:", n)
            clicked = n.getAttribute('data-delete')

            const outer = document.querySelector(`[data-out="${clicked}"]`)
            console.log('=== outer', outer)

            outer.parentElement.remove(); // удалили див полностью из дома
            delete storage[clicked]; // удалили из сторадж инфу о карточке
            localStorage.removeItem('users'); //стерли стораж
            localStorage.setItem('users', JSON.stringify(storage)); //перезаписали сторадж

        })
    })

    change.forEach(n => {
        n.addEventListener('click', () => {
            console.log('=== ПРИМЕНИТЬ кнопка')
            key = n.getAttribute('data-change'); // нашли email
            let newInfo = storage[key]; //запихиваем информацию о карточке в ньюинфо
            oldKey = key //определяем найденный ключ-емейл как старый ключ
            name.value = newInfo.name; //добавляем имя в инпут
            secondName.value = newInfo.secondName; // добавили фамилию в инпут
            email.value = newInfo.email; //добавляем емаил в инпут
            number.value = newInfo.number;
        })
    })
}

function clearLocalStorage() {
    window.location.reload()
    localStorage.removeItem('users')
}

function show(el) {
    el.style.display = 'block'
}

function hide(el) {
    el.style.display = 'none'
}

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')))
