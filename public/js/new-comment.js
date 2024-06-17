const $commentForms = document.querySelectorAll('new-comment-form');

async function sendData(data) {
	const file = document.getElementById('file-input').files[0];
	try {
		const formData = new FormData();
		for (const name in data) {
			console.log(name, data[name]);
		}
		for (const name in data) {
			formData.append(name, data[name]);
		}
		console.log(formData);
		const response = await fetch(`${FETCHURL}/new`, {
			method: 'POST',
			body: formData,
		});
		if (response.ok) console.log('successfully created post');
		console.log(response);
		window.location.href = '../posts';
	} catch (error) {
		console.log(error);
	}

	// ...
}

$commentForms.forEach(($commentForm) => {
	$commentForm.addEventListener('submit', (event) => {
		console.log('add comment clicked');
		// event.preventDefault();
		// console.log(event);
		// //const $commentInput = document.getElementById('content-input');

		// const userId = $commentForm.dataset.userid;
		// const postId = $commentForm.dataset.postid;

		// const FETCHURL = '/api/comments';

		// if (!userId) {
		// 	console.log(userId);
		// 	return;
		// }
		// const postDetails = {
		// 	content: $commentInput.value,
		// 	user_id: userId,
		// 	post_id: postId,
		// };
		// sendData(postDetails);
		//submitPost(userId, postDetails);
	});
});
