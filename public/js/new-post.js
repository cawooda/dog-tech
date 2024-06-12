const $postForm = document.getElementById('new-post-form');
console.log($postForm);
const $titleInput = document.getElementById('title-input');
const $contentInput = document.getElementById('content-input');

const userId = $postForm.dataset.userId;
console.log(userId);

const FETCHURL = '/api/posts';

const submitPost = async (userId, postDetails) => {
	try {
		const response = await fetch(FETCHURL, {
			method: 'POST',
			mode: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(postDetails),
		});
		if (response.ok) console.log('successfully created post');
		window.location.href = '../posts';
	} catch (error) {
		console.error(error);
	}
};

async function sendData(data) {
	const formData = new FormData();
	for (const name in data) {
		formData.append(name, data[name]);
	}
	const response = await fetch(FETCHURL, {
		method: 'POST',
		body: formData,
	});

	// ...
}

$postForm.addEventListener('submit', (event) => {
	console.log($contentInput.value);
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
