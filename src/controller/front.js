import { think } from 'thinkjs';
module.exports = class extends think.Controller {
  async __before() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'content-type,x-requested-with,accept,token,Authorization');
    this.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    this.header('Access-Control-Allow-Credentials', true);
    let method = this.ctx.method.toLowerCase();
    if (method === 'options') {
      this.ctx.status = 200;
      return false;
    }
  }
  /**
   * @description 文章列表
   * @returns {}
   */
  async articleListAction() {
    let article = this.model('article');
    let pageSize = this.get('pageSize') || 10;
    // let data = await article.join('blog_category ON blog_article.category=blog_category.category_id').select();
    let data = await article.page(this.get('page'), pageSize).countSelect();
    // 添加标签
    let tag = this.model('tag');
    let tagList = await tag.select();
    for (let i = 0; i < data.length; i++) {
      let tagArr = data[i].tag.split(',');
      let tagNameArr = [];
      for (let j = 0; j < tagArr.length; j++) {
        for (let k = 0; k < tagList.length; k++) {
          if (tagList[k].tag_id.toString() === tagArr[j]) {
            tagNameArr.push(tagList[k].tag_name);
          }
        }
      }
      data[i].tag_name = tagNameArr.join(',');
    }
    // 添加分类
    let category = this.model('category');
    let categoryList = await category.select();
    for (let i = 0; i < categoryList.length; i++) {
      let element = categoryList[i];
      for (let j = 0; j < data.length; j++) {
        if (element.category_id === data[j].category) {
          data[j].category = element.name;
        }
      }
    }
    this.success(data);
  }
  /**
    * @description 分类列表
    * @returns {}
    */
  async categoryListAction() {
    let category = this.model('category');
    let categoryList = await category.select();
    let article = this.model('article');
    let articleList = await article.select();
    for (let i = 0; i < categoryList.length; i++) {
      let element = categoryList[i];
      element.count = 0;
      for (let j = 0; j < articleList.length; j++) {
        if (element.category_id === articleList[j].category) {
          element.count += 1;
        }
      }
    }
    this.success(categoryList);
  }
  /**
    * @description 标签列表
    * @returns {}
    */
  async tagListAction() {
    let tag = this.model('tag');
    let tagList = await tag.select();
    let article = this.model('article');
    let articleList = await article.select();
    for (let i = 0; i < tagList.length; i++) {
      let element = tagList[i];
      element.count = 0;
      for (let j = 0; j < articleList.length; j++) {
        if (articleList[j].tag.indexOf(element.tag_id) >= 0) {
          element.count += 1;
        }
      }
    }
    this.success(tagList);
  }
  /**
   * @description 文章
   * @returns {}
   */
  async articleAction() {
    let id = this.get('id');
    let article = this.model('article');
    let data = await article.where({ id: id }).find();
    let tag = this.model('tag');
    let tagList = await tag.select();
    let tagArr = data.tag.split(',');
    let tagNameArr = [];
    for (let j = 0; j < tagArr.length; j++) {
      for (let k = 0; k < tagList.length; k++) {
        if (tagList[k].tag_id.toString() === tagArr[j]) {
          tagNameArr.push(tagList[k].tag_name);
        }
      }
    }
    data.tag_name = tagNameArr;
    this.success(data);
  }
  /**
   * @description 文章列表时间分组
   * @returns {}
   */
  async articleListByDateAction() {
    let article = this.model('article');
    // 加上标签名
    let list = await article.select();
    let tag = this.model('tag');
    let tagList = await tag.select();
    for (let i = 0; i < list.length; i++) {
      let tagArr = list[i].tag.split(',');
      let tagNameArr = [];
      for (let j = 0; j < tagArr.length; j++) {
        for (let k = 0; k < tagList.length; k++) {
          if (tagList[k].tag_id.toString() === tagArr[j]) {
            tagNameArr.push(tagList[k].tag_name);
          }
        }
      }
      list[i].tag_name = tagNameArr.join(',');
    }
    // 按时间分组
    let group = await article.query('SELECT publish_date FROM blog_article GROUP BY DATE_FORMAT(publish_date, "%m-%Y")');
    let groupList = [];
    for (let i = 0; i < group.length; i++) {
      let date = group[i];
      date.publish_date = await think.datetime(date.publish_date, 'YYYY-MM');
      groupList[i] = {
        time: date.publish_date,
        children: []
      };
      for (let j = 0; j < list.length; j++) {
        if (think.datetime(list[j].publish_date, 'YYYY-MM') === groupList[i].time) {
          groupList[i].children.push(list[j]);
        }
      }
    }
    this.success(groupList);
  }
  /**
   * @description 文章列表类别分组
   * @returns {}
   */
  async articleListByCategoryAction() {
    let article = this.model('article');
    let categoryId = this.get('categoryId');
    let list = await article.where({ category: categoryId }).select();
    let category = this.model('category');
    let name = await category.where({ category_id: categoryId }).getField('name');
    // 加上标签名
    let tag = this.model('tag');
    let tagList = await tag.select();
    for (let i = 0; i < list.length; i++) {
      let tagArr = list[i].tag.split(',');
      let tagNameArr = [];
      for (let j = 0; j < tagArr.length; j++) {
        for (let k = 0; k < tagList.length; k++) {
          if (tagList[k].tag_id.toString() === tagArr[j]) {
            tagNameArr.push(tagList[k].tag_name);
          }
        }
      }
      list[i].tag_name = tagNameArr.join(',');
    }
    let data = {
      name: name[0],
      list: list
    };
    this.success(data);
  }
  /**
   * @description 文章列表标签分组
   * @returns {}
   */
  async articleListByTagAction() {
    let article = this.model('article');
    let tagId = this.get('tagId');
    let list = await article.select();
    let tag = this.model('tag');
    let name = await tag.where({ tag_id: tagId }).getField('tag_name');
    let listData = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].tag.indexOf(tagId) > -1) {
        listData.push(list[i]);
      }
    }
    // 加上标签名
    let tagList = await tag.select();
    for (let i = 0; i < listData.length; i++) {
      let tagArr = listData[i].tag.split(',');
      let tagNameArr = [];
      for (let j = 0; j < tagArr.length; j++) {
        for (let k = 0; k < tagList.length; k++) {
          if (tagList[k].tag_id.toString() === tagArr[j]) {
            tagNameArr.push(tagList[k].tag_name);
          }
        }
      }
      listData[i].tag_name = tagNameArr.join(',');
    }
    let data = {
      name: name[0],
      list: listData
    };
    this.success(data);
  }
  /**
   * @description 数量
   * @returns {}
   */
  async countAction() {
    let article = this.model('article');
    let category = this.model('category');
    let tag = this.model('tag');
    let data = {
      article: await article.count(),
      category: await category.count(),
      tag: await tag.count()
    };
    this.success(data);
  }
};
