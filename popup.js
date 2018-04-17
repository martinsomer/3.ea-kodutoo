//opened popup
window.onload = function() {
    
    //stop continuous execution
    currentlyWorking = false
    
    //line break before column headers
    document.getElementById("buttonWrapper").appendChild(document.createElement("br"))
    document.getElementById("buttonWrapper").appendChild(document.createElement("br"))
    
    //column headers
    nobreak = document.createElement("nobr")
    span1 = document.createElement("span")
    span1.innerHTML = "DATE"
    span1.setAttribute("class", "date")
    nobreak.appendChild(span1)
    span2 = document.createElement("span")
    span2.innerHTML = "SPEED"
    span2.setAttribute("class", "speed")
    nobreak.appendChild(span2)
    document.getElementById("buttonWrapper").appendChild(nobreak)
    hline = document.createElement("hr")
    document.getElementById("buttonWrapper").appendChild(hline)
    
    //retrieve data from local storage
    if (localStorage.getItem("arr") !== null) {
        
        console.log("Importing data...")
        
        for (let i = 0; i < JSON.parse(localStorage.getItem('arr')).length; i++) {
            
            //add break when adding new elements
            if (document.getElementById("buttonWrapper").childElementCount > 5) {
                document.getElementById("buttonWrapper").appendChild(document.createElement("br"))
            }
            
            //append data in local storage
            nobreak = document.createElement("nobr")
            span1 = document.createElement("span")
            span1.innerHTML = JSON.parse(localStorage.getItem('arr'))[i][0]
            span1.setAttribute("class", "date")
            nobreak.appendChild(span1)
            span2 = document.createElement("span")
            span2.innerHTML = JSON.parse(localStorage.getItem('arr'))[i][1]
            span2.setAttribute("class", "speed")
            nobreak.appendChild(span2)
            document.getElementById("buttonWrapper").appendChild(nobreak)
        }
        console.log("Data import complete.")
    }
    
    //clicked button to mesure speed
    document.getElementById("checkButton").onclick = function() {
        
        
        //check if button is clickable
        if (currentlyWorking === false) {
            currentlyWorking = true
            
            console.log("Starting test...")
            
            //create break for new line of text
            if (document.getElementById("buttonWrapper").childElementCount > 5) {
                document.getElementById("buttonWrapper").appendChild(document.createElement("br"))
            }
            
            //get current time
            let currentTime = new Date()
            let day = currentTime.getDate() < 10 ? "0" + currentTime.getDate() : currentTime.getDate()
            let month = currentTime.getMonth() + 1 //months are counted from zero
            if (month < 10) {
                month = "0" + month
            }
            let hours = currentTime.getHours() < 10 ? "0" + currentTime.getHours() : currentTime.getHours()
            let minutes = currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()
            
            simpleTime = day + "." + month + "." + currentTime.getFullYear() + "<br>" + hours + ":" + minutes
            
            //new line of text
            nobreak = document.createElement("nobr")
            span1 = document.createElement("span")
            span1.innerHTML = simpleTime
            span1.setAttribute("class", "date")
            nobreak.appendChild(span1)
            span2 = document.createElement("span")
            span2.innerHTML = "Testing..."
            span2.setAttribute("class", "speed")
            nobreak.appendChild(span2)
            document.getElementById("buttonWrapper").appendChild(nobreak)
            
            InitiateSpeedDetection()
        }
    }
    
    //clicked button to clear data
    document.getElementById("clearButton").onclick = function() {
        
        //check if button is clickable
        if (currentlyWorking === false) {
            currentlyWorking = true
            
            console.log("Clearing data...")
            
            //clear local storage
            window.localStorage.clear()

            //remove child elements except for buttons
            while (document.getElementById("buttonWrapper").childElementCount > 5) {
                document.getElementById("buttonWrapper").removeChild(document.getElementById("buttonWrapper").children[5])
            }

            //resize body and html to shrink popup box (since it does not happen automatically)
            document.documentElement.style.height = document.getElementById('buttonWrapper').clientHeight
            document.body.style.height = document.getElementById('buttonWrapper').clientHeight
            
            console.log("Data clear success.")
            currentlyWorking = false
        }
    }
}

//this part of code was heavily inspired by stackoverflow.com/questions/5529718
function InitiateSpeedDetection() {
    
    window.setTimeout(MeasureConnectionSpeed, 1)
    
    const imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"
    const downloadSize = 4995374 //bytes
    
    function MeasureConnectionSpeed() {
        let startTime, endTime
        let download = new Image()
        download.onload = function () {
            endTime = (new Date()).getTime()
            showResults()
        }
        
        download.onerror = function (err, msg) {
            console.log("Invalid image, or error downloading.")
            span2.innerHTML = "Error"
        }
        
        startTime = (new Date()).getTime()
        let cacheBuster = "?nnn=" + startTime
        download.src = imageAddr + cacheBuster
        
        function showResults() {
            let duration = (endTime - startTime) / 1000
            let bitsLoaded = downloadSize * 8
            let speedBps = (bitsLoaded / duration).toFixed(2)
            let speedKbps = (speedBps / 1024).toFixed(2)
            let speedMbps = (speedKbps / 1024).toFixed(2)
            
            span2.innerHTML = speedMbps + "Mbps"
            console.log("Test success.")
            saveData(simpleTime, speedMbps + "Mbps")
            currentlyWorking = false
        }
    }
}

//save data to local storage
function saveData(date, speed) {
    
    console.log("Saving data...")
    
    arr = []
    if (window.localStorage.length == 0) {
        item = [date,speed]
        arr.push(item)
        localStorage.setItem('arr', JSON.stringify(arr))
    } else {
        let stored = JSON.parse(localStorage.getItem('arr'))
        let item2 = [date,speed]
        stored.push(item2)
        localStorage.setItem('arr', JSON.stringify(stored))
    }
    console.log("Data save success.")
}