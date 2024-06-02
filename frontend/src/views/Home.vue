<template>
  <div class="container-v">
    <div class ="discription-text">
        The PreAtlas database provides comprehensive resources and an interactive
        analysis platform for exploring the vast amount of bulk and single-cell
        transcriptomic data, as well as curated knowledges specially pertaining to
        diverse premalignant disease for 19 cancer types across 15 body sites.
    </div>
    <div class ="quick-search">Quick search</div>
    <div class="search-bar">
      <form>
          <input id="searchInput" name="index_none_header_sysc" type="text" 
          placeholder="e.g. TP53, Intestinal metaplasia, xx drug, ..." autocomplete="off">
          <input id="ai-quicksearch" class="submit mr-btn" value="Search" index="1" type="submit">
      </form>
    </div>
  </div>
  <div class="container-p">
    <div class="container-vl">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Recent News</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PreAtlas v2.0.0 released on 2024-06-01</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="citation">Citation:</div>
    </div>
    <!--
    <div class="organ-map">
      <img src="../assets/images/head.png" alt="organ image" class="organ_image">
    </div>
    -->
    <div class="container-vr">
      <img src="../assets/images/head.png" alt="data image" class="data_image">
      <div class="database">Related databases</div>
    </div>
  </div>
</template>

<script>

export default {
  name:'HomePage',
  data() {
    return {
      searchQuery: ''
    };
  }
};
</script>

<style scoped>
.container-v {
  display: flex;       
  flex-direction: column; 
  align-items: center; 
  width:100%;
  padding: 10px;
}
.discription-text {
  text-align: justify;
  color: black;
  background-color: lavender;
  padding: 15px;
  border-radius: 10px;
  width: 900px; 
  height: 50px; /* 设置高度 */
  margin:10px 5px;
  word-spacing: 2px;
  align-self: flex-end;
  display: flex; /* 开启Flexbox布局 */
  align-items: center; /* 垂直居中文本 */
  justify-content: center; /* 水平居中文本 */
}

.quick-search {
  text-align: center;
  color: black;
  padding: 10px;
  width:100%;
  margin-top: 10px;
  font-weight: bold;
  font-size: 20px;
}

.search-bar{
  display:flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  height: 70px;
}

input[type="text"]{
  width:500px;
  padding:5px;
  font-size:15px;
}

.submit{
  font-size:15px;
  padding:10px 15px;
}
.mr-btn {
  margin-top: 8px; /* 设置顶部边距 */
}

.container-p{
  display: flex;       
  flex-direction: row; 
  justify-content: space-between;
  align-items:flex-start;
}

.container-vl{
  display: flex;
  flex-direction: column;
}

.table-container{
  width:400px;
  border-collapse: inherit;
  margin-right:auto;
}

.table-container th,.table-container td{
  border:1px solid #040404;
  width:400px;
  padding:10px;
  text-align:center;
}

.table-container th{
  font-weight:200;
  font-size:30px;
}

.table-container td{
  font-size:15px;
}

.citation{
  text-align: justify;
  color: black;
  background-color: lavender;
  padding: 15px;
  border-radius: 10px;
  width: 400px; 
  height: 25px; /* 设置高度 */
  margin:100px 0px;
  align-self: flex-start;
  display: flex; /* 开启Flexbox布局 */
}
/*
.organ-map{
  width:100px;
  height:50px;
  align-self:flex-start;
  margin:10px,10px;
}
*/
.container-vr{
  flex-direction: column;
  align-content: flex-start;
}

.data_image{
  width:400px;
  height:400px;
  margin:10px,10px;
}

.database{
  padding:10px;
  align-self: flex-start;
  font-size:20px;
  font-weight:bold;
}
</style>
