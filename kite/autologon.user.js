// ==UserScript==
// @name         Auto-Login to Kite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AutoLogin to Kite
// @author       You
// @match        https://kite.zerodha.com/?next=*
// @match        https://kite.zerodha.com/
// @match        https://kite.zerodha.com
// @icon         https://www.google.com/s2/favicons?domain=kite.zerodha.com
// @require      https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js
// @grant        none
// @run-at       document-idle
// @nocompat     Chrome
// ==/UserScript==

// Create a new TOTP object.

(function() {
    'use strict';
    let totp = new OTPAuth.TOTP({
        secret: 'SECRET' // or "OTPAuth.Secret.fromBase32('NB2W45DFOIZA')"
    });

    const observer = new MutationObserver(function() {
        doLoginAttempt();
    });

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    async function doLoginAttempt(){
        await sleep(1000);
        var container = document.querySelector("#container");
        observer.disconnect();
        let userField = document.querySelector("#userid");
        let passwordField = document.querySelector("#password");
        let continueBtn = document.querySelector("#container > div.content > div > div > form > div.actions > button");
        let twoFAfield = document.querySelector("div.twofa-value > input");

        if(userField) {
            userField.value = "USERNAME";
            userField.dispatchEvent(new Event('input'));
            await sleep(1000);
            continueBtn.click();
        }

        if(passwordField) {
            passwordField.value = "PASSWORD";
            passwordField.dispatchEvent(new Event('input'));
            await sleep(1000);
            continueBtn.click();
        }
        if(twoFAfield) {
            twoFAfield.value = totp.generate();
            twoFAfield.dispatchEvent(new Event('input'));
        }
        observer.observe(container, {subtree: true, childList: true});
    }
    window.addEventListener('load', function() {
        doLoginAttempt();
    }, false);

})();
