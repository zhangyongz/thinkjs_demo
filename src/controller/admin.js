import { think } from 'thinkjs';
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口

const Base = require('./base.js');
module.exports = class extends Base {
  /**
   * @description 登录
   * @returns {}
   */
  async loginAction() {
    let username = this.post('username');
    let password = this.post('password');
    let user = this.model('user');
    let data = await user.where({
      username: username,
      password: think.md5(password)
    }).find();
    if (!think.isEmpty(data)) {
      data.token = think.md5(username) + think.md5(password);
      this.cache('userinfo', data);
      this.success(data, '登录成功');
    } else {
      this.fail(-1, '用户名或密码错误');
    }
  }
  /**
   * @description 注册
   * @returns {}
   */
  async regAction() {
    let username = this.post('username');
    let password = this.post('password');
    let user = this.model('user');
    let exitedUser = await user.where({ username: username }).find();
    if (think.isEmpty(exitedUser)) {
      await user.add({
        username: username,
        password: think.md5(password),
        reg_date: think.datetime()
      });
      this.success('注册成功');
    } else {
      this.fail(-1, '用户已存在');
    }
  }
  /**
   * @description 上传文章
   * @returns {}
   */
  async uploadArticleAction() {
    let title = this.post('title');
    let value = this.post('value');
    let render = this.post('render');
    let category = this.post('category');
    let tag = this.post('tag').join(',');
    let describle = this.post('describle');
    let coverImg = this.post('cover_img');
    let article = this.model('article');
    await article.add({
      title: title,
      value: value,
      render: render,
      publish_date: think.datetime(),
      change_date: think.datetime(),
      category: category,
      tag: tag,
      describle: describle,
      cover_img: coverImg
    });
    this.success('添加成功');
  };
  /**
   * @description 更新文章
   */
  async updateArticleAction() {
    let id = this.post('id');
    let title = this.post('title');
    let value = this.post('value');
    let render = this.post('render');
    let category = this.post('category');
    let tag = this.post('tag').join(',');
    let describle = this.post('describle');
    let coverImg = this.post('cover_img');
    let article = this.model('article');
    await article.where({ id: id }).update({
      title: title,
      value: value,
      render: render,
      change_date: think.datetime(),
      category: category,
      tag: tag,
      describle: describle,
      cover_img: coverImg
    });
    this.success('更新成功');
  }
  /**
   * @description 删除文章
   * @returns {}
   */
  async deleArticleAction() {
    let id = this.post('id');
    let article = this.model('article');
    await article.where({ id: id }).delete();
    this.success('删除成功');
  }
  /**
  * @description 上传图片
  * @returns {}
  */
  async uploadImgAction() {
    const file = this.file('image');
    let relativePath = 'static/upload/' + think.md5(Date.now()) + '.' + file.type.substring(6);
    const filepath = path.join(think.ROOT_PATH, 'www/' + relativePath);
    think.mkdir(path.dirname(filepath));
    await rename(file.path, filepath);
    console.log(filepath);
    // await think.timeout(3000);
    return this.success(relativePath, '上传成功!');
  }
  /**
   * @description 添加分类
   * @returns {}
   */
  async addCategoryAction() {
    let name = this.post('name');
    let category = this.model('category');
    await category.add({
      name: name
    });
    this.success('添加成功');
  }
  /**
   * @description 删除分类
   * @returns {}
   */
  async deleCategoryAction() {
    let id = this.post('id');
    let category = this.model('category');
    await category.where({ category_id: id }).delete();
    this.success('删除成功');
  }
  /**
   * @description 编辑分类
   * @returns {}
   */
  async editCategoryAction() {
    let id = this.post('id');
    let name = this.post('name');
    let category = this.model('category');
    await category.where({ category_id: id }).update({ name: name });
    this.success('编辑成功');
  }
  /**
   * @description 添加标签
   * @returns {}
   */
  async addTagAction() {
    let name = this.post('name');
    let tag = this.model('tag');
    await tag.add({
      tag_name: name
    });
    this.success('添加成功');
  }
  /**
   * @description 删除标签
   * @returns {}
   */
  async deleTagAction() {
    let id = this.post('id');
    let tag = this.model('tag');
    await tag.where({ tag_id: id }).delete();
    this.success('删除成功');
  }
  /**
   * @description 编辑标签
   * @returns {}
   */
  async editTagAction() {
    let id = this.post('id');
    let name = this.post('name');
    let tag = this.model('tag');
    await tag.where({ tag_id: id }).update({ tag_name: name });
    this.success('编辑成功');
  }
};
