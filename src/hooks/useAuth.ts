"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';
import {  useSetRecoilState } from 'recoil';
import { isLoggedIn } from './../atoms/atom';


function useAuth() {
    const [user, setUser] = useState<User | null>(null); 
    const setIsLogged = useSetRecoilState(isLoggedIn); 


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            console.log("onAuthStateChanged:", currentUser);
            setUser(currentUser);
            setIsLogged(true)
        });

        return () => unsubscribe();
    }, []);

    return user;
}

export default useAuth;
