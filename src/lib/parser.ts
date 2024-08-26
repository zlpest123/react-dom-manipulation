/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list (also referred as the block list)
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */
const bodyElements = document.body.childNodes;
let parsedElements: ChildNode[] = [];

export function getTopLevelReadableElementsOnPage(): ChildNode[] {
  parsedElements = [];
  candiates(bodyElements);
  return parsedElements;
}

const isEmptyText = (node: Node) => {
  return node.nodeName === "#text" && node.textContent?.trim().length === 0;
};

const isEmptyElement = (node: Node) => {
  if (node.nodeName !== "#text") {
    if (node.childNodes.length === 0) {
      return true;
    } else if (node.childNodes.length === 1) {
      return isEmptyText(node.childNodes[0]);
    } else {
      return false;
    }
  }
};

const isInIgnoreList = (node: Node) => {
  let nodeName = node.nodeName;
  for (let i = 0; i < IGNORE_LIST.length; i++) {
    if (nodeName === IGNORE_LIST[i]) {
      return true;
    }
  }
  return false;
};

const trueNodeCount = (node: Node) => {
  let childNodes = node.childNodes;
  let count = 0;
  for (let childNode of childNodes) {
    if (!isEmptyText(childNode) && !isEmptyElement(childNode) && !isInIgnoreList(childNode)) {
      count++;
    }
  }
  return count;
};

const isText = (node: Node) => {
  return node.nodeName === "#text" && node.textContent?.trim().length !== 0;
};

const hasTextContent = (element: ChildNode) => {
  let childNodes = element.childNodes;
  return [...childNodes].some((node) => isText(node));
};

const checkParentChildLength = (element: ChildNode) => {
  let count: number|undefined = 0;
  while (1) {
    count = element.parentElement?.children.length;
    if (count === 1) {
      element = element.parentElement!;
    } else {
      break;
    }
  }
  return element;
};

const insertTopReadableElement = (element: ChildNode) => {
  if (!isInIgnoreList(element)) {
    let parsedElement = checkParentChildLength(element);
    parsedElements.push(parsedElement);
    console.log(parsedElement);
  }
};

const candiates = (nodes: NodeListOf<ChildNode>) => {
  for (let node of nodes) {
    if (trueNodeCount(node)) {
      if (!hasTextContent(node)) {
        candiates(node.childNodes);
      } else {
        insertTopReadableElement(node);
      }
    }
  }
};
