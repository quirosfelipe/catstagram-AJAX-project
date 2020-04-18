const startLoad = () => {
    document.querySelector('.loader').innerHTML = 'Loading ...';
};
const stopLoad = () => {
    document.querySelector('.loader').innerHTML = '';
};
const clearError = () => {
    document.querySelector('.error').innerHTML = '';
}
const response = function (res) {
    if (!res.ok) {
        throw res;
    }
    return res.json();
}
const error = (err) => {
    document.querySelector('.cat-pic').src = '';
    err.json().then(errorData => {
        document.querySelector('.error').innerHTML = errorData.message;//alert('Something went wrong! Please try again!');
        stopLoad();
    });
}
window.addEventListener('DOMContentLoaded', () => fetchImage());
document.getElementById('new-pic').addEventListener('click', () => fetchImage());


const fetchImage = () => {
    clearError();
    document.querySelector('.comments').innerHTML = '';
    startLoad();
    fetch('/kitten/image')
        .then(response)
        .then(data => {
            console.log(data);
            document.querySelector('.cat-pic').src = data.src;
            stopLoad();
        })
        .catch(error);
}
const updateScore = function (data) {
    //{score:1} = data
    document.querySelector('.score').innerHTML = data.score; //  or data['score'];
}
const updateComment = function (data) {
    const comments = document.querySelector('.comments');
    comments.innerHTML = '';
    data.comments.forEach(comment => {
        const newCommentContainer = document.createElement('div');
        newCommentContainer.className = 'comment-container';
        const newComment = document.createElement('h1');
        newComment.innerHTML = comment;
        newCommentContainer.appendChild(newComment);
        comments.appendChild(newCommentContainer);
        document.getElementById('user-comment').value = '';
    });
    //const comentario = document.createTextNode(data.comments);
    //newComment.appendChild(comentario);
}
document.querySelector('#upvote').addEventListener('click', () => {
    fetch('kitten/upvote', { method: 'PATCH' })
        .then(response)
        .then(updateScore)
        .catch(error);
});
document.querySelector('#downvote').addEventListener('click', () => {
    fetch('kitten/downvote', { method: 'PATCH' })
        .then(response)
        .then(updateScore)
        .catch(error);
});
document.querySelector('.comment-form').addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(document.querySelector('.comment-form'));
    const comment = formData.get('user-comment');
    fetch('kitten/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment }) // { comment: comment }key matches with variable name on line 73
    })
        .then(response)
        .then(updateComment)
        .catch(error);
});


