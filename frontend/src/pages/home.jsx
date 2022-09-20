import { useEffect } from 'react';

function Home() {
    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('auth'),
            },
        };
        fetch('http://localhost:3005/', reqOptions)
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => {
                window.location.replace('login');
                console.log(err);
            });
    }, []);

    return <div>Vous etes connecté</div>;
}

export default Home;
