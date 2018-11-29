const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * @description 登录
   * @returns {}
   */
  loginAction() {
    this.rules = {
      username: {
        required: true
      },
      password: {
        required: true
      }
    };
  }
  /**
 * @description 注册
 * @returns {}
 */
  regAction() {
    this.rules = {
      username: {
        required: true
      },
      password: {
        required: true,
        byteLength: { min: 6, max: 16 }
      }
    };
  }
  /**
   * @description 上传文章
   * @returns {}
   */
  uploadArticleAction() {
    this.rules = {
      title: {
        required: true
      },
      value: {
        required: true
      },
      render: {
        required: true
      },
      category: {
        required: true,
        int: true
      },
      tag: {
        required: true
      },
      describle: {
        required: true
      },
      cover_img: {
        required: true
      }
    };
  }
  /**
   * @description 添加分类
   * @returns {}
   */
  addCategoryAction() {
    this.rules = {
      name: {
        required: true
      }
    };
  }
  /**
   * @description 添加标签
   * @returns {}
   */
  addTagAction() {
    this.rules = {
      name: {
        required: true
      }
    };
  }
};
