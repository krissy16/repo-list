'use strict'

function handleForm(){
    $('form').on('submit', function(event){
        event.preventDefault();
        const handle = $('#username').val();
        $('#username').val("");
        console.log("Repos for " + handle + " are being retrieved!");
        getRepos(handle);
    });
}

function getRepos(handle){
    const url=`https://api.github.com/users/${handle}/repos`;
    const options={
        headers: new Headers({
            "Accept": "application/vnd.github.v3+json"
        })
    };
    
    console.log("Retrieving results from " + url);

    fetch(url, options)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, handle))
        .catch(err => {
            displayFailure(err.message);
        });
}

function displayResults(repos, handle){
    $('.result-list').empty();
    console.log("Working: "+ JSON.stringify(repos[0]));

    $('.result-title').text(`Results for: ${handle}`);
    for(let i=0; i<repos.length; i++){
        $('.result-list').append(`
            <li>Title: ${repos[i].name}</li>
            <li class="link">Repo URL: ${repos[i].html_url}</li>
        `);

    }
    $('.result-section').removeClass('hidden');
}

function displayFailure(message){
    if(message == "Not Found") {
        message= "GitHub handle could not be found"
    }
    $('.result-title').text(`Error:`);
    $('.result-list').html(`<li>Something went wrong: ${message}</li>`);
    $('.result-section').removeClass('hidden');
}

$(handleForm);

/*
https://api.github.com/users/:username/repos

headers:
    Accept: application/vnd.github.v3+json

parameters:
    type: all/owner/member (default: owner)
    sort: created/updated/pushed/full_name (default: full_name)
    direction: asc/desc (default: asc if full_name otherwise desc)
*/