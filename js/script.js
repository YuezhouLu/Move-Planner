function loadData() {
    var $body = $('body');
    var $greeting = $('#greeting');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $wikiElem = $('#wikipedia-links');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // 1. load streetview
    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    console.log(address);

    $greeting.text('So, you want to live at ' + address + '?');

    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyBmETQV5L9rBhD2nCuq1zYl4ujA96Mb8fI';
    $body.append('<img class="bgimg" src="' + streetViewUrl + '" alt="background image">');
    

    // 2. load nytimes
    // YOUR CODE GOES HERE!
    var nyTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyTimesUrl += '?' + $.param({
        'api-key': "dc82eba08f9a47599ac2231fb4c06e26",
        'q': cityStr,
        'begin_date': "20181107",
        'sort': "newest"
    });

    $.getJSON(nyTimesUrl, function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        console.log(typeof data, data);
        articles = data.response.docs;
        console.log(typeof articles, articles);

        for (i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'
                + '<a href="' + article.web_url + '">' + article.headline.main + '</a>'
                + '<p>' + article.snippet + '</p>'
                + '</li>');
        };
    }).error(function(failedReason) {
        console.log(failedReason);
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    
    // 3. load wikipedia data
    // YOUR CODE GOES HERE!
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiHeaderElem.text('Failed To Get Wikipedia Resources');
    }, 8000);

    $.ajax(wikiUrl, {
        // url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response) {
            console.log(typeof response, response);
            articleList = response[1];

            for (j = 0; j < articleList.length; j++) {
                articleStr = articleList[j];
                var searchUrl = 'https://en.wikipedia.org/wiki/' + articleStr + '';
                $wikiElem.append('<li>'
                    + '<a href="' + searchUrl + '">' + articleStr + '</a>'
                    + '</li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);