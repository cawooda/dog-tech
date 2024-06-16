const $postForm = document.getElementById('new-post-form');
console.log($postForm);
const $titleInput = document.getElementById('title-input');
const $contentInput = document.getElementById('content-input');

const userId = $postForm.dataset.userId;
console.log(userId);

const FETCHURL = '/api/posts';

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
		if (file) {
			formData.append('file', file);
		}
		console.log(formData);
		const response = await fetch(`${FETCHURL}/new`, {
			method: 'POST',
			body: formData,
		});
		if (response.ok) console.log('successfully created post');
		window.location.href = '../posts';
	} catch (error) {
		console.log(error);
	}

	// ...
}

$postForm.addEventListener('submit', (event) => {
	console.log($contentInput.value);
	console.log($titleInput.value);

	event.preventDefault();
	if (!userId) {
		console.log(userId);
		return;
	}
	const postDetails = {
		title: $titleInput.value,
		content: $contentInput.value,
		user_id: userId,
	};
	sendData(postDetails);
	//submitPost(userId, postDetails);
});
