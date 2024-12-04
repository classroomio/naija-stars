<script>
  export let data = {
    author: '',
    author_link: '',
    author_avatar: ''
  };
</script>

<div class="flex items-center gap-3">
  <a href={`${data.author_link}`}>
    <img src={data.author_avatar} alt="" class="w-7 rounded-full" />
  </a>

  <a href={`${data.author_link}`}> {data.author}</a>
</div>
