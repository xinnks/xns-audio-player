<template>
	<div class="tw-flex tw-flex-column tw-h-full tw-w-full tw-m-3 tw-items-center tw-justify-around tw-mt-1 tw-mx-auto tw-mb-3 tw-p-2">
		<div class="about-content">
			<h2>About Page</h2>
			<div class="illustration" >
				<img src="/img/pluto-page-under-construction.png" alt="">
        Illustration by <a target="_blank" href="http://www.saramaese.com">Sara Maese</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'HomePage'
	}
</script>

<style>
.about-container, .illustration, .about-content{
	text-align: center;
	align-content: space-around;
	padding-top: 20px
}
.illustration > img {
	width: 20rem;
}
</style>