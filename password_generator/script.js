const inputSlider = document.querySelector("[data-lengthSlider]"); 
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");

const copyMsg = document.querySelector("[data-copyMsg] span");
const uppercaseCheck = document.querySelector("#uppercase"); 
const lowercaseCheck = document.querySelector("#lowercase");

const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '!@#$%^&*(){}[]-+=_<>,.?/:|~`';   // Symbols to be picked from the string "symbols"


let password = "";
let passwordLength= 10;
let checkCount = 0;

// password length ko UI pr show krta hai 

handleSlider();
// set strength circle to grey

setIndicator("#ccc");

function handleSlider(){

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}



function setIndicator(color){
    console.log("vedd");
    if(indicator !== null || indicator == null){
        console.log("Hello!!!!");
        indicator.style.backgroundColor = color;
        indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

    }
    
    // shadow 
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)+min) ; 
}


function generateRandomNumber(){

    return getRndInteger(0,9);

}


function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym && passwordLength >=8)){

        setIndicator("#0f0");
    }

    else if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=6){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }

}
    // Copy to clipboard button VERY IMPORTANT concept of Promise 

    async function copyContent(){  // async function is used for when we use await in our function 

        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "copied";
            console.log("copy done");
        }

        catch(e){
            copyMsg.innerText = "Failed";

        }

        // to copy wala span visible 
        copyMsg.classList.add("active");
        
        setTimeout(() => {

            copyMsg.classList.remove("active");

        } , 2000);

    }

    function shufflePassword(array){
        // Fischer Yates Method 

        for(let i = array.length-1;i>0;i--){

            const j = Math.floor(Math.random() * (i+1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp ;

        }

        let str = "";
        array.forEach((e1) => (str += e1));
        return str;

    }

    function handleCheckBoxChange(){
        checkCount = 0;
        allCheckBox.forEach((checkbox) =>{
            if(checkbox.checked)
            checkCount++;
        });

        // special condition 

        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
    }



    allCheckBox.forEach((checkbox) => {
        checkbox.addEventListener('change',handleCheckBoxChange);
    })


    inputSlider.addEventListener('input',(e) =>{
        passwordLength = e.target.value;
        handleSlider();
    })



    copyBtn.addEventListener('click' , () => {
        if(passwordDisplay.value){
            copyContent();
        }
    } )


    generateBtn.addEventListener('click', () => {
        // none of the checkbox are selected 

        if(checkCount <=0) 
        return;

        if(passwordLength< checkCount){
            passwordLength = checkCount;
            handleSlider();
        }

        // lets start find new password 

        console.log("Starting the Journey");
        // remove old password 
        password = "";

        // if(uppercaseCheck.checked){
        //     password += generateUppercase();
        // }

        // if(lowercaseCheck.checked){
        //     password += generateLowerCase();
        // }

        // if(numbersCheck.checked){
        //     password += generateRandomNumber();
        // }

        // if(symbolsCheck.checked){
        //     password += generateSymbol();
        // }


        let funcArr = [];
       
        if(uppercaseCheck.checked){
            funcArr.push(generateUppercase);
        }

        if(lowercaseCheck.checked){
            funcArr.push(generateLowerCase);
        }
        
        if(numbersCheck.checked){
            funcArr.push(generateRandomNumber);
        }

        if(symbolsCheck.checked){
            funcArr.push(generateSymbol);
        }

        // COMPULSORY ADDITION 

        for(let  i=0;i<funcArr.length; i++){

            password += funcArr[i]();

        }

        console.log("Compulsory Addition Done");

        for(let i =0;i<passwordLength-funcArr.length;i++){
            let randIndex = getRndInteger(0,funcArr.length);

            password+= funcArr[randIndex]();
            // password += funcArr[i]();
        }

        console.log("Remaining  Addition Done");
        // shuffle the password 

        password = shufflePassword(Array.from(password));

        console.log("Shuffling Done");
        // show in UI 

        passwordDisplay.value = password;
        
        console.log("UI Addition Done");
        // calculate Strength 
        calcStrength();
    });


    