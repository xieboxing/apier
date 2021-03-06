import omit from "lodash/omit";
import pick from "lodash/pick";
import merge from "lodash/merge";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";

// 注释键值, `optional`, `type=integer`, `description="split with ws"`, `a.b[0].c=3`
const RG_COMMENT_VALUE = /([^\s=]+)(\=("[^"]*"|'[^']*'|[^\s]+))?/g;

export interface CommentObject {
  [k: string]: any;
}
export interface CommentItem {
  paths: string[];
  comment: CommentObject;
}

export class ApierComment {
  public readonly comments: CommentItem[];
  constructor(comments = []) {
    this.comments = comments;
  }
  public append(paths: string[], commentText: string) {
    let comment = this.parse(commentText);
    if (!comment) {
      return;
    }
    const existCommentObj = this.find(paths);
    if (!existCommentObj) {
      this.comments.push({ paths, comment });
      return;
    }
    merge(existCommentObj.comment, comment);
  }
  public scope(paths: string[]) {
    const comments = this.comments
      .filter(c => isPrefixArray(paths, c.paths))
      .map(c => ({ paths: c.paths.slice(paths.length), comment: c.comment }));
    return new ApierComment(comments);
  }
  public retrive(paths: string[] = []): CommentUtil {
    const commentItem = this.find(paths);
    return new CommentUtil(commentItem ? commentItem.comment : {});
  }
  private find(paths: string[]): CommentObject {
    return this.comments.find(c => paths.length === c.paths.length && isPrefixArray(paths, c.paths));
  }

  /**
   * 获取行注释
   *
   * `optional type=integer format=int32` => { optional: true, type: integer, format: int32 }
   */
  private parse(commentText: string): { [k: string]: any } {
    const result = {};
    let matched;
    while ((matched = RG_COMMENT_VALUE.exec(commentText))) {
      const key = matched[1];
      let value = matched[3];
      if (value === undefined) {
        value = true;
      } else {
        try {
          value = JSON.parse(value);
        } catch (err) {}
      }
      lodashSet(result, key, value);
    }
    return result;
  }
}

export class CommentUtil {
  private readonly comment: CommentObject;
  constructor(comment: CommentObject) {
    this.comment = comment;
  }
  omit(keys: string[]) {
    return omit(this.comment, keys);
  }
  pick(keys: string[]) {
    return pick(this.comment, keys);
  }
  val(key?: string, defaultValue?: any) {
    if (key === undefined) return { ...this.comment };
    return lodashGet(this.comment, key, defaultValue);
  }
}

function isPrefixArray<T>(prefixArr: T[], arr: T[]) {
  return prefixArr.every((v, i) => arr[i] === v);
}
