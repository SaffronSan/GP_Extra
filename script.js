import { Z2V0QWNjZXNzVG9rZW4, Z2V0Q2l0eVdlYXRoZXI } from "./aGFuZGxlS0VZUw.js";
(function () {
    const pagesData = [];
    let cities = [], isPopState = false, packages = [],
        reHistory = {
            "citySearch": {
                "search": [], "raw": []
            }, "hotelSearch": {
                "search": [], "raw": []
            },
            "tnks": "",
            "lastCity": "",
            "weather": {}
        }

    /**
     * This function switches the page based on the provided page name.
     * @param {String} page 
     * @returns 
     */
    function switchPage(page) {
        const isPageDes = page.includes("des");
        const existPage = findPageIndex(page, isPageDes);
        page = page.includes("index") ? "home" : page;
        if (existPage !== -1) {
            renderCachedPage(page, isPageDes, existPage);
            return;
        }
        fetchAndRenderPage(page, isPageDes);
    }
    /**
     * Finds if the page exists in the cached pages data.
     * @param {String} page 
     * @param {Boolean} isPageDes 
     * @returns 
     */
    function findPageIndex(page, isPageDes) {
        return pagesData.findIndex((item) => {
            return Object.keys(item)[0].includes(isPageDes ? "destinations" : page);
        });
    }
    /**
     * If the page exists in the cache, this function renders it from the array, pagesData.
     * @param {String} page 
     * @param {Boolean} isPageDes 
     * @param {Boolean} existPage 
     */
    function renderCachedPage(page, isPageDes, existPage) {
        $("main").html(pagesData[existPage][isPageDes ? "destinations" : page]);
        if (isPageDes) {
            handleDestinationPage(page);
        } else {
            handleRegularPage(page);
        }
        localStorage.setItem("lastPage", page);
        attachLinkBtnHandlers();
    }
    /**
     * Fetchs the page from the pages directory and renders it.
     * @param {String} page 
     * @param {Boolean} isPageDes 
     */
    function fetchAndRenderPage(page, isPageDes) {
        try {
            $.ajax({
                url: `/pages/${isPageDes ? "destinations" : page}.html`,
                method: "GET",
                dataType: "html",
                success: (data) => {
                    $("main").html(data);
                    localStorage.setItem("lastPage", page);
                    if (isPageDes) {
                        handleDestinationPage(page);
                    } else {
                        handleRegularPage(page);
                    }
                    attachLinkBtnHandlers();
                    pagesData.push({ [isPageDes ? "destinations" : page]: data });
                },
                error: () => {
                    $("main").text("Sorry! The Page did not load!");
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * This handles the destination page by extracting the city name from the page string.
     * @param {String} page 
     */
    function handleDestinationPage(page) {
        let cityName = page.slice(4);
        const itemD = cities.find((val) => val.cityName.includes(cityName));
        if (itemD === undefined) {
            let error = $("<h1>").text("This destiniations does not exist!");
            $("main").html(error);
            throw new Error("City does not exist");
        }
        desCityBuilder(cityName);
        if (isPopState) {
            history.pushState({ page: 'destinations', id: cityName }, '', `/pages/destinations.html?city=${cityName}`);
        }
        isPopState = true;
        $("title").text(titleCase(cityName));
    }
    /**
     * Handles the regular pages 
     * @param {String} page 
     */
    function handleRegularPage(page) {
        if (isPopState) {
            history.pushState({ "pages": page }, '', `/pages/${page}.html`);
        }
        if (page.includes("package")) {
            setUpPackages();
        }
        if (page.includes("hotel")) {
            desLinkBuilder(cities, "#city-opts", false);
            if (reHistory.citySearch.raw.length > 0) {
                $("#city-opts").val(reHistory.lastCity)
                serviceBuilder(reHistory.citySearch.raw[reHistory.citySearch.search.length - 1], "#data-render", true);
                $("#we-city").text(cities.find((item) => item.cityCode.includes(reHistory.lastCity)).cityName)
            }
            if (Object.keys(reHistory.weather).length > 0) {
                weatherBuilder(reHistory.weather);
            }
            $("#searchCity").click((e) => {
                searchCity($("#city-opts").val());
            })
        }
        isPopState = true;
        $("title").text(titleCase(page));
    }
    /**
     * Attaches click event handlers to all elements with the class 'link-btn'.
     */
    function attachLinkBtnHandlers() {
        $(".link-btn").each(function (ind, ele) {
            $(ele).off("click").on("click", function (e) {
                switchPageClickEffect(e.target.getAttribute("routes"));
            });
        });
    }
    /**
     * Return a title case item
     * @param {String} item 
     * @returns 
     */
    function titleCase(item) {
        return item[0].toUpperCase() + item.slice(1, item.length);
    }
    /**
     * This fills the destinations page with a item also fills the wonder
     * @param {Object} item 
     */
    function desCityBuilder(item) {
        const itemD = cities.find((val) => val.cityName.includes(item)),
            crumbs = $("<h5/>").text(itemD.cityName).addClass("text-accent underline bold");
        let index = cities.indexOf(itemD);
        //$(".des-banner").attr("src", itemD.cityBannerImg);
        $(".des-head").text(itemD.cityName);
        $(".des-description").text(itemD.cityDescription)
        $(".des-loc").text(itemD.cityLoc)
        $(".des-attr").text(itemD.cityAttribute)
        $(".des-crumbs").append(crumbs);
        $(".city-Name").text(itemD.cityName)
        $(".des-large").attr("src", itemD.cityLargeImg)
        // Builds Wonders
        const wonders = itemD.cityWonders;
        const wondersEle = wonders.map((item) => {
            let container = $("<div>").addClass("rounded-xl p-3 text-white flex flex-col items-center space-y-2 size-full mx-auto shadow-sm bg-primary/50 xl:px-2 xl:py-2 xl:mx-0"),
                textContainer = $("<div>").addClass("p-2 flex flex-col space-y-2"),
                name = $("<h4/>").addClass("text-lx font-bold xl:text-2xl").text(item.wonderName),
                img = $("<img/>").addClass("rounded-xl object-cover size-full xl:w-[30rem] xl:h-[20rem] aspect-square shadow-sm ").attr("src", item.wonderImg),
                description = $("<p>").addClass("text-sm xl:text-lg xl:w-[20rem] font-light").text(item.wonderDescription);
            textContainer.append(name, description)
            container.append(img, textContainer);
            return container
        });
        for (var item of wondersEle) {
            $(".des-wonder").append(item)
        }
        // Builds tops stuff based on cityTop Keys
        Object.keys(itemD.cityTop).forEach((item, index) => {
            $("." + item).text(Object.values(itemD.cityTop)[index]).addClass(" p-2 xl:p-3")
        })
        index = (index + 3) >= cities.length ? 0 : index
        desCardBuilder(cities.slice(index + 1, index + 4))
    }
    /**
     * Creates the destinations buttons sFERpj4GwyTtEpPAWh9lpsLwjv5T
     */
    function desLinkBuilder(data, place, image = true) {
        data.forEach((item, index) => {
            let container = $(image ? "<div/>" : "<option/>").addClass(`flex items-center space-x-2 space-y-1 p-2 ${index + 1 === data.length ? "hover:rounded-b-xl" : "hover:rounded-none"}`),
                img = $("<img/>").attr("src", item.cityBannerImg).addClass("rounded size-10 ").attr("alt", item.cityName),
                btn = $("<h5/>").text(item.cityName).addClass("inline hover:cursor-pointer capitalize link-btn ").attr("routes", "des-" + item.cityName);
            if (image) {
                container.append(img);
            }
            if (!image) {
                container.val(item.cityCode)
            }
            container.append(btn);
            $(place).append(container);
        })
    }
    /**
     * This builds the destination cards for the other cities
     * @param {Array} dataArr 
     */
    function desCardBuilder(dataArr) {
        dataArr.forEach((item) => {
            let container = $("<div/>")
                .attr("routes", "des-" + item.cityName).on("click", (e) => switchPageClickEffect(e.target.getAttribute("routes")))
                .addClass("flex flex-col items-center space-y-4 rounded hover:cursor-pointer shadow-sm bg-secondary/50 xl:px-2 xl:py-5 xl:p-10 ease-in-out delay-100 hover:scale-90 transition-all"),
                seal = $("<img/>").attr("src", item.cityBannerImg).addClass("size-20").attr("routes", "des-" + item.cityName),
                cityName = $("<h3/>").text(item.cityName).addClass("capitalize text-white text-2xl").attr("routes", "des-" + item.cityName);
            container.append(seal, cityName)
            $(".des-other").append(container);
        })
    }
    /**
     * Builds Packes Containers
     * @param {Object} packages 
     */
    function packageBuilder(packages) {
        packages.forEach((item) => {
            let container = $("<div/>").addClass("bg-white rounded-xl p-3 shadow-sm border-gray-200 h-full flex flex-col justify-between items-center"),
                img = $("<img/>").addClass("rounded-xl object-cover size-[25rem] aspect-square shadow-xs").attr("src", item.image),
                textContainer = $("<div/>").addClass("p-2 w-full flex flex-col items-center space-between"),
                inlcudesContainer = $("<div/>").addClass("flex flex-col space-y-2 mb-3"),
                includesTitle = $("<h5/>").addClass("text-lg font-semibold text-gray-900").text("This Package Includes:"),
                includesList = $("<ul/>").addClass("list-disc pl-6 space-y-2 mb-2 text-gray-600 mt-4 overflow-auto h-[10rem]"),
                includesNight = $("<li/>").text(item.includes.nights),
                includesFeatures = $("<li/>").text(item.includes.feature),
                includesExcursionsTitle = $("<li/>").addClass("text-lg font-semibold text-gray-900 mt-2").text("Excursions:"),
                includesExcursionsContainer = $("<ol/>").addClass("list-decimal pl-6 mt-1 text-gray-500 space-y-1"),
                titleContainer = $("<div/>").addClass("flex flex-col space-y-2 justify-center items-center mb-3"),
                title = $("<h5/>").addClass("mb-2 text-xl md:text-2xl xl:text-4xl font-bold text-left tracking-tight text-gray-900").text(item.packageName),
                attrTitle = $("<h5/>").addClass("text-sm font-semibold text-gray-500").text(item.packageAttr),
                btnContainer = $("<div/>").addClass("flex flex-col p-5 items-center md:flex-row md:space-y-0 md:space-x-2 space-y-2"),
                description = $("<p/>").addClass("mb-3 font-normal text-gray-700").text(item.description),
                price = $("<span/>").addClass("p-5 text-sm").text("Starting at "),
                priceValue = $("<span/>").addClass("font-bold").text(item.price),
                route = $("<button/>").addClass("p-5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-accent hover:cursor-pointer link-btn")
                    .attr("routes", "des-" + item.packageName).text("Explore " + item.packageName);
            item.includes.excursions.forEach((excursion) => {
                let excursionItem = $("<li/>").text(excursion);
                includesExcursionsContainer.append(excursionItem);
            });
            price.append(priceValue);
            titleContainer.append(title, attrTitle);
            btnContainer.append(price, route);
            includesList.append(includesNight, includesExcursionsTitle, includesExcursionsContainer, includesFeatures);
            inlcudesContainer.append(includesTitle, includesList);
            textContainer.append(titleContainer, description, inlcudesContainer, btnContainer);
            container.append(img, textContainer);
            $(".packs-cont").append(container);
        });
        attachLinkBtnHandlers();
    }
    /**
     * Builds Weather Container
     * @param {Object} weather 
     */
    function weatherBuilder(weather) {
        $("#weather-render").empty();
        if(Object.keys(weather).length === 0){
            return;
        }
        reHistory.weather = weather;
        $("#weather-cont").removeClass("hidden");
        localStorage.setItem("totalData", btoa(JSON.stringify(reHistory)))
        const card = $("<div/>")
            .addClass("mx-4 my-2 flex flex-col md:space-x-4 md:flex-row items-center bg-primary/70 rounded-xl shadow-sm overflow-hidden p-4");
        const iconUrl = weather.condition && weather.condition.icon ? `https:${weather.condition.icon}` : "";
        const icon = $("<img/>")
            .attr("src", iconUrl)
            .attr("alt", "Weather Icon")
            .addClass("w-16 h-16 mx-auto");
        const tempC = weather.temp_f !== undefined ? weather.temp_c : "N/A";
        const temperature = $("<p/>")
            .text(`Temperature: ${tempC}°C`)
            .addClass("xl:text-lg xl:p-2 text-xl font-medium text-center");
        const conditionText = weather.condition && weather.condition.text ? weather.condition.text : "N/A";
        const condition = $("<p/>")
            .text(`Condition: ${conditionText}`)
            .addClass("xl:text-lg xl:p-2  text-xl font-medium text-center");
        const wind = weather.wind_kph !== undefined ? weather.wind_kph + " kph" : "N/A";
        const windDir = weather.wind_dir || "";
        const windInfo = $("<p/>")
            .text(`Wind: ${wind} ${windDir}`)
            .addClass("xl:text-lg xl:p-2 text-xl font-medium text-center");
        const humidity = weather.humidity !== undefined ? weather.humidity + "%" : "N/A";
        const humidityEl = $("<p/>")
            .text(`Humidity: ${humidity}`)
            .addClass("xl:text-lg xl:p-2 text-xl font-medium text-center");
        card.append(icon, location, temperature, condition, windInfo, humidityEl);
        localStorage.setItem("totalData", btoa(JSON.stringify(reHistory)))
        $("#weather-render").append(card);
    }
    /**
     * Renders the cities also can force wait for a second
     * @param {Object} data 
     * @param {String} place 
     * @param {Boolean} renderAgain 
     * @returns void
     */
    function serviceBuilder(data, place, renderAgain = false) {
        const loader = document.getElementById('loader');
        $(place).empty()
        if (data.hasOwnProperty("errors")) {
            errorServiceBuilder(data.errors[0]);
            return;
        }
        if (renderAgain) {
            $("#loader").removeClass("hidden")
        }
        setTimeout(() => {
            if (renderAgain) {
                $("#loader").addClass("hidden")
            }
            data.data.forEach((item, index) => {
                if (index >= 21) {
                    return;
                }
                let staticAddress = $("<span/>").text("Address: "), addressCont = $("<p/>"),
                    container = $("<div/>").addClass("flex flex-col space-y-2 justify-between text-center ").attr("id", item.hotelId),
                    hotelName = $("<h3/>").addClass("lowercase first-letter:uppercase font-bold md:text-xl w-fit text-wrap mx-auto").text(item.name),
                    hotelAddress = $("<span/>").addClass("lowercase first-letter:uppercase").text(item.address.lines[0]),
                    hotelPostal = $("<p/>").text("Postal Code: " + item.address.postalCode).addClass(""),
                    learnMoreBtn = $("<button/>").addClass("cursor-pointer border-1 border-secondary text-white w-fit mx-auto rounded-xl px-4 hover:bg-secondary hover:text-primary").text("Learn More"),
                    hotelExtra = $("<div/>").addClass("extra "),
                    hotelPic = $("<img/>").addClass("rounded-xl size-64 mx-auto object-cover")
                        .attr("alt", "hotel picture").attr("src", "https://d2s2rtcxxwjegp.cloudfront.net/images/hotels/hotel_placeholder.png"),
                    waster = makeWaste();
                addressCont.append(staticAddress, hotelAddress, hotelPostal)
                hotelExtra.append(waster)
                container.append(hotelName, hotelPic, addressCont, hotelExtra, learnMoreBtn);
                learnMoreBtn.click((e) => {
                    searchHotel(item.hotelId);
                })
                $(place).append(container);
                if (reHistory.hotelSearch.search.includes(item.hotelId)) {
                    hotelErrorBuilder(reHistory.hotelSearch.raw[reHistory.hotelSearch.search.indexOf(item.hotelId)], item.hotelId, true);
                }
            })
        }, renderAgain ? 1000 : 0);

    }
    /**
     * Renders a error message
     * @param {Object} data 
     * @param {Boolean} waitRender 
     */
    function errorServiceBuilder(data, renderAgain = false) {
        if (renderAgain) {
            $("#loader").removeClass("hidden")
        }
        setTimeout(() => {
            const status = $("<p/>").text("Status: " + data.status).addClass("flex flex-col justify-center"),
                title = $("<h2/>").text(data.title).addClass("flex flex-col justify-center"),
                code = $("<p/>").text("Code: " + data.code).addClass("flex flex-col justify-center");
            if (renderAgain) {
                $("#loader").addClass("hidden")
            }
            $("#data-render").empty().append(status, title, code);
        }, renderAgain ? 1000 : 0);
    }
    /**
     * Builds extra Hotels info and adds to the Hotels container 
     * @param {Object} data 
     * @param {String} place 
     * @param {Boolean} renderAgain 
     */
    function hotelExtraBuilder(data, place, renderAgain = false) {
        $(`#${place}`).empty();
        const description = $("p").text(data.data[0].offers.room.description.text);
        $(`#${place}`).append(description);
    }
    /**
     * Builds error messages info and adds to the Hotels container 
     * @param {Object} error 
     * @param {String} place 
     * @param {Boolean} renderAgain 
     */
    function hotelErrorBuilder(error, place, renderAgain = false) {
        $(`#${place} .extra`).empty();
        const data = error.errors[0], waste = makeWaste();
        if (renderAgain) {
            waste.removeClass("hidden");
            $(`#${place} .extra`).append(waste)
        }
        setTimeout(() => {
            const status = $("<p/>").text("Status: " + data.status).addClass("font-semibold "),
                title = $("<h2/>").text(data.title).addClass("text-lg font-bold"),
                sourceParam = data.source && data.source.parameter ? data.source.parameter : "N/A";
            const errorCard = $("<div/>").addClass("p-4 text-white").append(status, title);
            if (renderAgain) {
                $(`#${place} .extra`).empty();
            }
            $(`#${place} .extra`).append(errorCard);
        }, renderAgain ? 1000 : 0);

    }
    /**
     * This fetches cities.json and performace a optional
     * callback inside of the fetch
     * @param {Function} callback 
     */
    function setUpCities(callback) {
        $.getJSON("data/cities.json", (data) => {
            cities = data.data;
            desLinkBuilder(cities, ".des-cont");
            desLinkBuilder(cities, "#foo-des-links");
            if (callback) {
                callback();
            }
        });
    }
    /**
     * fetches packages data and renders them
     * @returns void
     */
    function setUpPackages() {
        if (packages.length > 0) {
            packageBuilder(packages);
            return;
        }
        $.getJSON("../data/packages.json", (data) => {
            packages = data.data;
            packageBuilder(data.data);
        });
    }
    /**
     * This handles click effect for switching pages, also hides the
     * destinations container and scrolls to the top if not at top
     * @param {Text} ele 
     */
    function switchPageClickEffect(ele) {
        let route = String(ele);
        if (!localStorage.getItem("lastPage").includes(route)) {
            switchPage(route);
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        $(".des-cont").slideUp("linear");
    }
    function makeWaste() {
        return $("<div/>").addClass("waste-sec hidden flex items-center justify-center")
            .append($("<div/>").addClass("loader border-t-[#0e2525] animate-spin ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"))
    }
    /**
     * Fetches Hotels details 
     * @param {String} hotel 
     * @returns 
     */
    async function searchHotel(hotel) {
        let hasCalled = false;
        const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotel}`,
            waste = $(`#${hotel} .extra .waste-sec`);
        waste.removeClass("hidden")
        if (reHistory.tnks.length == 0) {
            reHistory.tnks = await Z2V0QWNjZXNzVG9rZW4();
        }
        if (reHistory.hotelSearch.search.includes(hotel)) {
            return;
        }
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${reHistory.tnks}`
                },
                mode: "cors",
                cath: "default"
            })
            const data = await response.json();
            if (data.errors[0].status === 401 && !hasCalled) {
                hasCalled = true;
                reHistory.tnks = await Z2V0QWNjZXNzVG9rZW4();
                searchHotel(hotel);
            }
            if (data.hasOwnProperty("errors")) {
                hotelErrorBuilder(data, hotel)
            } else {
                hotelExtraBuilder(data, hotel, false)
            }
            reHistory.hotelSearch.raw.push(data);
            reHistory.hotelSearch.search.push(hotel);
            localStorage.setItem("totalData", btoa(JSON.stringify(reHistory)))
            waste.addClass("hidden")
        } catch (error) {
            console.log(error);
        }
    }/**
     * Fetches hotels by Citites 
     * @param {String} city 
     * @returns void
     */
    async function searchCity(city) {
        let hasCalled = false;
        const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${city}`,
            regularCityName = cities.find((item) => item.cityCode.includes(city)).cityName;
        $("#we-city").text(regularCityName)
        const wDATA = await Z2V0Q2l0eVdlYXRoZXI(regularCityName);
        reHistory.weather = wDATA;
        weatherBuilder(reHistory.weather)
        $("#weather-cont").removeClass("hidden")
        if (reHistory.citySearch.search.includes(city)) {
            reHistory.lastCity = city;
            serviceBuilder(reHistory.citySearch.raw[reHistory.citySearch.search.findIndex((item) => item.includes(city))], "#data-render", true);
            return;
        }
        if (reHistory.tnks.length == 0) {
            reHistory.tnks = await Z2V0QWNjZXNzVG9rZW4();
        }
        const waster = $("#loader");
        waster.removeClass("hidden");
        try {
            $("#data-render").empty()
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${reHistory.tnks}`
                },
                mode: "cors",
                cath: "default"
            })
            const data = await res.json();
            if (!data.hasOwnProperty("errors")) {
                reHistory.citySearch.raw.push(data);
                reHistory.citySearch.search.push(city);
                reHistory.lastCity = city;
                serviceBuilder(data, "#data-render", false);
            }
            else if (data.errors[0].status === 401 && !hasCalled) {
                hasCalled = true;
                reHistory.tnks = await Z2V0QWNjZXNzVG9rZW4();
                searchCity(city);
            } else {
                errorServiceBuilder(data.errors[0], false);
            }
            waster.addClass("hidden")
            localStorage.setItem("totalData", btoa(JSON.stringify(reHistory)))
        } catch (error) {
            console.log(error)
        }

    }
    /**
     * This will excute when the document is fulley loaded
     */
    $(document).ready(() => {
        // By default the Home page will be loaded first 
        if (localStorage.getItem("lastPage") === null) {
            localStorage.setItem("lastPage", "home");
            switchPage("home");
        } else {
            setUpCities(() => {
                isPopState = true;
                switchPage(localStorage.getItem("lastPage"));
                $(".link-btn").click((e) => switchPageClickEffect(e.target.getAttribute("routes")));
            })
        }
        if (localStorage.getItem("totalData")) {
            reHistory = JSON.parse(atob(localStorage.getItem("totalData")));
        }
        $(".des-cont").hide();
        $("#des-btn").click(() => {
            $(".des-cont").slideToggle("linear");
        })
    })
    /**
     * Handles Backs & Forward Navgiations
     */
    $(window).on("popstate", function (event) {
        let params = new URLSearchParams(window.location.search);
        let cityName = params.get("city");
        let path = window.location.pathname;
        let page = path.split("/").pop().replace(".html", "");
        isPopState = false;
        if (page === "destinations" && cityName) {
            switchPage("des-" + cityName);
        } else {
            switchPage(page);
        }
    });
})();
