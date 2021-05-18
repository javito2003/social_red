export default function saveInLocalStorage(token, userData){
    const auth = {
        token: token,
        userData: userData
    }

    const deleteLocal = localStorage.removeItem('auth')
    localStorage.setItem('auth', JSON.stringify(auth))
}

