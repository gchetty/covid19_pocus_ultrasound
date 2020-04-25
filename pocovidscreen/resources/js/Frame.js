import {AppContext} from './context/AppContext';
import React, {lazy, Suspense, useContext, useEffect, useRef} from 'react';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher'
import Logo from './components/Logo/Logo'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Power3, TimelineLite, TweenMax} from 'gsap';
import {Helmet} from 'react-helmet';
import Button from './components/Button/Button';
import GuestRoute from './router/GuestRoute';
import AuthRoute from './router/AuthRoute';
import configuration from './utils/constants';

const Home = lazy(() => import('./pages/Home/Home'));
const Train = lazy(() => import('./pages/Train/Train'));
const Screen = lazy(() => import('./pages/Screen/Screen'));
const SignIn = lazy(() => import('./pages/Auth/SignIn'));
const SignUp = lazy(() => import('./pages/Auth/SignUp'));
const LoadingMessage = () => `loading...`;

const Frame = () => {
    const context = useContext(AppContext);

    document.documentElement.className = context.themeMode === 'light' ? 'light' : 'dark';

    let app = useRef(null);
    let headerItems = useRef(null);
    let masterTl = new TimelineLite();

    useEffect(() => {
        TweenMax.to(app, 0, {css: {visibility: 'visible'}});
        if (localStorage.getItem('animated-once') === null) {
            masterTl.from(headerItems.children[0], 1, {opacity: 0, delay: .8, ease: Power3.easeOut}, 'Start master')
                .from(headerItems.children[1], 1, {opacity: 0, delay: .8, ease: Power3.easeOut}, .3)
                .from(headerItems.children[2], 1, {opacity: 0, delay: .8, ease: Power3.easeOut}, .3);

            localStorage.setItem('animated-once', 'true');
        }

    })

    const addChild = (child, position) => {
        masterTl.add(child, position);
    }

    return (
        <div className="app" ref={el => app = el}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>{configuration.appTitle}</title>
                <link rel="canonical" href="http://mysite.com/example"/>
            </Helmet>
            <header className="app-header py-4 container">
                <div className="row justify-content-between" ref={el => headerItems = el}>
                    <div className="col text-left">
                        <ThemeSwitcher/>
                    </div>
                    <div className="col d-none d-md-block text-center">
                        <Logo/>
                    </div>
                    <div className="col text-right">
                        <Button className="simple mr-3" href="/sign-in" text="Sign in"/>
                        <Button className="round primary" href="/sign-up" text="Sign up"/>
                    </div>
                </div>
            </header>
            <BrowserRouter>
                <Switch>
                    <Suspense fallback={<LoadingMessage/>}>
                        <GuestRoute exact path="/" component={() => <Home/>}/>
                        <AuthRoute exact path="/train" alertMessage="You need to sign in before to train."
                                   component={() => <Train/>}/>
                        <GuestRoute exact path="/screen" alertMessage="You need to sign in before to screen."
                                   component={() => <Screen/>}/>
                        <GuestRoute exact path="/sign-in" component={() => <SignIn/>}/>
                        <GuestRoute exact path="/sign-up" component={() => <SignUp/>}/>
                    </Suspense>
                    <Route render={() => <h2>404 Page Not Found</h2>}/>
                </Switch>
            </BrowserRouter>
        </div>
    )
};

export default Frame;
