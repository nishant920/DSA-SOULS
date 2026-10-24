/**
 * Master data parsed from DSA_SOULS_PLAN.md
 * 8 main areas + Archdragon Peak side quest
 */

export const areas = [
  {
    id: "hashing",
    order: 1,
    name: "Hashing and Prefix Sums",
    cue: "have I seen this before? or sum of a range",
    easy: [
      { id: "lc-1", number: 1, title: "Two Sum", slug: "two-sum" },
      { id: "lc-217", number: 217, title: "Contains Duplicate", slug: "contains-duplicate" },
      { id: "lc-242", number: 242, title: "Valid Anagram", slug: "valid-anagram" },
      { id: "lc-303", number: 303, title: "Range Sum Query - Immutable", slug: "range-sum-query-immutable" }
    ],
    medium: [
      { id: "lc-49", number: 49, title: "Group Anagrams", slug: "group-anagrams" },
      { id: "lc-560", number: 560, title: "Subarray Sum Equals K", slug: "subarray-sum-equals-k" },
      { id: "lc-128", number: 128, title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence" },
      { id: "lc-238", number: 238, title: "Product of Array Except Self", slug: "product-of-array-except-self" },
      { id: "lc-525", number: 525, title: "Contiguous Array", slug: "contiguous-array" },
      { id: "lc-454", number: 454, title: "4Sum II", slug: "4sum-ii" }
    ],
    boss: { id: "lc-41", number: 41, title: "First Missing Positive", slug: "first-missing-positive" }
  },
  {
    id: "two-pointers",
    order: 2,
    name: "Two Pointers",
    cue: "sorted array, pairs, or in-place rearranging",
    easy: [
      { id: "lc-125", number: 125, title: "Valid Palindrome", slug: "valid-palindrome" },
      { id: "lc-283", number: 283, title: "Move Zeroes", slug: "move-zeroes" },
      { id: "lc-26", number: 26, title: "Remove Duplicates from Sorted Array", slug: "remove-duplicates-from-sorted-array" },
      { id: "lc-977", number: 977, title: "Squares of a Sorted Array", slug: "squares-of-a-sorted-array" }
    ],
    medium: [
      { id: "lc-167", number: 167, title: "Two Sum II", slug: "two-sum-ii-input-array-is-sorted" },
      { id: "lc-15", number: 15, title: "3Sum", slug: "3sum" },
      { id: "lc-16", number: 16, title: "3Sum Closest", slug: "3sum-closest" },
      { id: "lc-11", number: 11, title: "Container With Most Water", slug: "container-with-most-water" },
      { id: "lc-75", number: 75, title: "Sort Colors", slug: "sort-colors" },
      { id: "lc-881", number: 881, title: "Boats to Save People", slug: "boats-to-save-people" }
    ],
    boss: { id: "lc-42", number: 42, title: "Trapping Rain Water", slug: "trapping-rain-water" }
  },
  {
    id: "sliding-window",
    order: 3,
    name: "Sliding Window",
    cue: "contiguous subarray or substring with a constraint",
    easy: [
      { id: "lc-121", number: 121, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock" },
      { id: "lc-643", number: 643, title: "Maximum Average Subarray I", slug: "maximum-average-subarray-i" },
      { id: "lc-219", number: 219, title: "Contains Duplicate II", slug: "contains-duplicate-ii" },
      { id: "lc-1456", number: 1456, title: "Maximum Number of Vowels in a Substring of Given Length", slug: "maximum-number-of-vowels-in-a-substring-of-given-length" }
    ],
    medium: [
      { id: "lc-3", number: 3, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters" },
      { id: "lc-424", number: 424, title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement" },
      { id: "lc-567", number: 567, title: "Permutation in String", slug: "permutation-in-string" },
      { id: "lc-209", number: 209, title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum" },
      { id: "lc-1004", number: 1004, title: "Max Consecutive Ones III", slug: "max-consecutive-ones-iii" },
      { id: "lc-904", number: 904, title: "Fruit Into Baskets", slug: "fruit-into-baskets" }
    ],
    boss: { id: "lc-76", number: 76, title: "Minimum Window Substring", slug: "minimum-window-substring" }
  },
  {
    id: "binary-search",
    order: 4,
    name: "Binary Search",
    cue: "sorted or monotonic, or \"find the minimum X that works\"",
    easy: [
      { id: "lc-704", number: 704, title: "Binary Search", slug: "binary-search" },
      { id: "lc-35", number: 35, title: "Search Insert Position", slug: "search-insert-position" },
      { id: "lc-69", number: 69, title: "Sqrt(x)", slug: "sqrtx" },
      { id: "lc-278", number: 278, title: "First Bad Version", slug: "first-bad-version" }
    ],
    medium: [
      { id: "lc-34", number: 34, title: "Find First and Last Position of Element in Sorted Array", slug: "find-first-and-last-position-of-element-in-sorted-array" },
      { id: "lc-74", number: 74, title: "Search a 2D Matrix", slug: "search-a-2d-matrix" },
      { id: "lc-153", number: 153, title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array" },
      { id: "lc-33", number: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array" },
      { id: "lc-875", number: 875, title: "Koko Eating Bananas", slug: "koko-eating-bananas" },
      { id: "lc-1011", number: 1011, title: "Capacity to Ship Packages Within D Days", slug: "capacity-to-ship-packages-within-d-days" }
    ],
    boss: { id: "lc-4", number: 4, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays" }
  },
  {
    id: "stack",
    order: 5,
    name: "Stack and Monotonic Stack",
    cue: "matching pairs, or \"next greater/smaller element\"",
    easy: [
      { id: "lc-20", number: 20, title: "Valid Parentheses", slug: "valid-parentheses" },
      { id: "lc-496", number: 496, title: "Next Greater Element I", slug: "next-greater-element-i" },
      { id: "lc-844", number: 844, title: "Backspace String Compare", slug: "backspace-string-compare" },
      { id: "lc-682", number: 682, title: "Baseball Game", slug: "baseball-game" }
    ],
    medium: [
      { id: "lc-155", number: 155, title: "Min Stack", slug: "min-stack" },
      { id: "lc-150", number: 150, title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation" },
      { id: "lc-739", number: 739, title: "Daily Temperatures", slug: "daily-temperatures" },
      { id: "lc-503", number: 503, title: "Next Greater Element II", slug: "next-greater-element-ii" },
      { id: "lc-853", number: 853, title: "Car Fleet", slug: "car-fleet" },
      { id: "lc-901", number: 901, title: "Online Stock Span", slug: "online-stock-span" }
    ],
    boss: { id: "lc-84", number: 84, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram" }
  },
  {
    id: "linked-list",
    order: 6,
    name: "Linked List",
    cue: "pointer surgery, cycles, or middle-finding (fast/slow)",
    easy: [
      { id: "lc-206", number: 206, title: "Reverse Linked List", slug: "reverse-linked-list" },
      { id: "lc-141", number: 141, title: "Linked List Cycle", slug: "linked-list-cycle" },
      { id: "lc-21", number: 21, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists" },
      { id: "lc-876", number: 876, title: "Middle of the Linked List", slug: "middle-of-the-linked-list" }
    ],
    medium: [
      { id: "lc-2", number: 2, title: "Add Two Numbers", slug: "add-two-numbers" },
      { id: "lc-19", number: 19, title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list" },
      { id: "lc-142", number: 142, title: "Linked List Cycle II", slug: "linked-list-cycle-ii" },
      { id: "lc-143", number: 143, title: "Reorder List", slug: "reorder-list" },
      { id: "lc-138", number: 138, title: "Copy List with Random Pointer", slug: "copy-list-with-random-pointer" },
      { id: "lc-148", number: 148, title: "Sort List", slug: "sort-list" }
    ],
    boss: { id: "lc-25", number: 25, title: "Reverse Nodes in k-Group", slug: "reverse-nodes-in-k-group" }
  },
  {
    id: "trees",
    order: 7,
    name: "Trees (DFS/BFS)",
    cue: "recursion on left/right, or level by level",
    easy: [
      { id: "lc-104", number: 104, title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree" },
      { id: "lc-226", number: 226, title: "Invert Binary Tree", slug: "invert-binary-tree" },
      { id: "lc-100", number: 100, title: "Same Tree", slug: "same-tree" },
      { id: "lc-543", number: 543, title: "Diameter of Binary Tree", slug: "diameter-of-binary-tree" }
    ],
    medium: [
      { id: "lc-102", number: 102, title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal" },
      { id: "lc-199", number: 199, title: "Binary Tree Right Side View", slug: "binary-tree-right-side-view" },
      { id: "lc-1448", number: 1448, title: "Count Good Nodes in Binary Tree", slug: "count-good-nodes-in-binary-tree" },
      { id: "lc-98", number: 98, title: "Validate Binary Search Tree", slug: "validate-binary-search-tree" },
      { id: "lc-236", number: 236, title: "Lowest Common Ancestor of a Binary Tree", slug: "lowest-common-ancestor-of-a-binary-tree" },
      { id: "lc-105", number: 105, title: "Construct Binary Tree from Preorder and Inorder Traversal", slug: "construct-binary-tree-from-preorder-and-inorder-traversal" }
    ],
    boss: { id: "lc-124", number: 124, title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum" }
  },
  {
    id: "heap",
    order: 8,
    name: "Heap / Top-K",
    cue: "\"k largest/smallest/most frequent\", or a running median",
    easy: [
      { id: "lc-1046", number: 1046, title: "Last Stone Weight", slug: "last-stone-weight" },
      { id: "lc-703", number: 703, title: "Kth Largest Element in a Stream", slug: "kth-largest-element-in-a-stream" },
      { id: "lc-506", number: 506, title: "Relative Ranks", slug: "relative-ranks" }
    ],
    medium: [
      { id: "lc-347", number: 347, title: "Top K Frequent Elements", slug: "top-k-frequent-elements" },
      { id: "lc-215", number: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array" },
      { id: "lc-973", number: 973, title: "K Closest Points to Origin", slug: "k-closest-points-to-origin" },
      { id: "lc-621", number: 621, title: "Task Scheduler", slug: "task-scheduler" },
      { id: "lc-767", number: 767, title: "Reorganize String", slug: "reorganize-string" },
      { id: "lc-692", number: 692, title: "Top K Frequent Words", slug: "top-k-frequent-words" }
    ],
    boss: { id: "lc-295", number: 295, title: "Find Median from Data Stream", slug: "find-median-from-data-stream" }
  }
];

export const sideQuest = {
  id: "archdragon-peak",
  name: "Archdragon Peak (BST)",
  unlocksAfterArea: "trees",
  keyIdea: "BST + inorder traversal = sorted order",
  warmup: [
    { id: "lc-700", number: 700, title: "Search in a Binary Search Tree", slug: "search-in-a-binary-search-tree" },
    { id: "lc-701", number: 701, title: "Insert into a Binary Search Tree", slug: "insert-into-a-binary-search-tree" },
    { id: "lc-235", number: 235, title: "Lowest Common Ancestor of a Binary Search Tree", slug: "lowest-common-ancestor-of-a-binary-search-tree" },
    { id: "lc-108", number: 108, title: "Convert Sorted Array to Binary Search Tree", slug: "convert-sorted-array-to-binary-search-tree" }
  ],
  medium: [
    { id: "lc-230", number: 230, title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst" },
    { id: "lc-653", number: 653, title: "Two Sum IV - Input is a BST", slug: "two-sum-iv-input-is-a-bst" },
    { id: "lc-450", number: 450, title: "Delete Node in a BST", slug: "delete-node-in-a-bst" },
    { id: "lc-173", number: 173, title: "Binary Search Tree Iterator", slug: "binary-search-tree-iterator" }
  ],
  miniBoss: { id: "lc-99", number: 99, title: "Recover Binary Search Tree", slug: "recover-binary-search-tree" },
  hiddenBoss: { id: "lc-315", number: 315, title: "Count of Smaller Numbers After Self", slug: "count-of-smaller-numbers-after-self" }
};
