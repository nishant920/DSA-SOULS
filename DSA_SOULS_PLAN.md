# DSA Souls v2: Focused Run (Areas 1-8 + BST Side Quest)

A pattern-wise DSA plan structured like a Souls game: learn the area, level up on side quests, beat the boss, move on.

## Structure

| Stage | Count per area | Souls equivalent |
|---|---|---|
| Easy | 4 (3 in Area 8) | Learning the area, basic enemies |
| Medium | 6 | Side quests and levelling up |
| Boss | 1 | The boss (a hard problem) |

About **86 questions** for the main run, plus **10** for the optional BST side quest. At 2 problems/day: roughly 6-7 weeks plus revisits.

**Skip rule for easies:** if you clear the first 2 easies in an area in under 10 minutes each, skip the remaining 2. Don't farm weak enemies.

## Rules of the game

1. **Time-box.** Easy: 20 min. Medium: 35 min. Boss: 75 min. If still stuck after the box, read a hint, not the full solution.
2. **Death = you looked at the solution.** Re-solve it from scratch the next day with no peeking. It doesn't count as cleared until you do.
3. **Gate to the boss.** Fight the boss only after solving the mediums without help.
4. **Bonfire (revision).** After each boss, redo one random problem from the previous area before starting the next.
5. **Boss is a learning tool, not a verdict.** Hards are rare in fresher interviews. If the boss beats you twice, read the solution, write it up in notes, and move on. Don't burn 3 days on one problem.
6. **Before every problem, write one line:** "This is a ___ problem because ___." That sentence is the actual skill you're training.
7. **After each boss, write 5 lines of notes:** the cue, the template, the common bug, and the problem that taught you the most.

## Area 1: Hashing and Prefix Sums
*Cue: "have I seen this before?" or "sum of a range".*
- Easy: Two Sum (1), Contains Duplicate (217), Valid Anagram (242), Range Sum Query - Immutable (303)
- Medium: Group Anagrams (49), Subarray Sum Equals K (560), Longest Consecutive Sequence (128), Product of Array Except Self (238), Contiguous Array (525), 4Sum II (454)
- **Boss: First Missing Positive (41)**

## Area 2: Two Pointers
*Cue: sorted array, pairs, or in-place rearranging.*
- Easy: Valid Palindrome (125), Move Zeroes (283), Remove Duplicates from Sorted Array (26), Squares of a Sorted Array (977)
- Medium: Two Sum II (167), 3Sum (15), 3Sum Closest (16), Container With Most Water (11), Sort Colors (75), Boats to Save People (881)
- **Boss: Trapping Rain Water (42)**

## Area 3: Sliding Window
*Cue: contiguous subarray or substring with a constraint.*
- Easy: Best Time to Buy and Sell Stock (121), Maximum Average Subarray I (643), Contains Duplicate II (219), Maximum Number of Vowels in a Substring of Given Length (1456)
- Medium: Longest Substring Without Repeating Characters (3), Longest Repeating Character Replacement (424), Permutation in String (567), Minimum Size Subarray Sum (209), Max Consecutive Ones III (1004), Fruit Into Baskets (904)
- **Boss: Minimum Window Substring (76)**

## Area 4: Binary Search
*Cue: sorted or monotonic, or "find the minimum X that works".*
- Easy: Binary Search (704), Search Insert Position (35), Sqrt(x) (69), First Bad Version (278)
- Medium: Find First and Last Position of Element in Sorted Array (34), Search a 2D Matrix (74), Find Minimum in Rotated Sorted Array (153), Search in Rotated Sorted Array (33), Koko Eating Bananas (875), Capacity to Ship Packages Within D Days (1011)
- **Boss: Median of Two Sorted Arrays (4)**

Note: the last two mediums are "binary search on the answer", the second flavor of this pattern. Spend extra time on them.

## Area 5: Stack and Monotonic Stack
*Cue: matching pairs, or "next greater/smaller element".*
- Easy: Valid Parentheses (20), Next Greater Element I (496), Backspace String Compare (844), Baseball Game (682)
- Medium: Min Stack (155), Evaluate Reverse Polish Notation (150), Daily Temperatures (739), Next Greater Element II (503), Car Fleet (853), Online Stock Span (901)
- **Boss: Largest Rectangle in Histogram (84)**

## Area 6: Linked List
*Cue: pointer surgery, cycles, or middle-finding (fast/slow).*
- Easy: Reverse Linked List (206), Linked List Cycle (141), Merge Two Sorted Lists (21), Middle of the Linked List (876)
- Medium: Add Two Numbers (2), Remove Nth Node From End of List (19), Linked List Cycle II (142), Reorder List (143), Copy List with Random Pointer (138), Sort List (148)
- **Boss: Reverse Nodes in k-Group (25)**

## Area 7: Trees (DFS/BFS)
*Cue: recursion on left/right, or level by level.*
- Easy: Maximum Depth of Binary Tree (104), Invert Binary Tree (226), Same Tree (100), Diameter of Binary Tree (543)
- Medium: Binary Tree Level Order Traversal (102), Binary Tree Right Side View (199), Count Good Nodes in Binary Tree (1448), Validate Binary Search Tree (98), Lowest Common Ancestor of a Binary Tree (236), Construct Binary Tree from Preorder and Inorder Traversal (105)
- **Boss: Binary Tree Maximum Path Sum (124)**

## Area 8: Heap / Top-K
*Cue: "k largest/smallest/most frequent", or a running median.*
- Easy: Last Stone Weight (1046), Kth Largest Element in a Stream (703), Relative Ranks (506)
- Medium: Top K Frequent Elements (347), Kth Largest Element in an Array (215), K Closest Points to Origin (973), Task Scheduler (621), Reorganize String (767), Top K Frequent Words (692)
- **Boss: Find Median from Data Stream (295)**

## Side Quest: Archdragon Peak (BST)
*Unlocks after Area 7. Optional, not required for the main run.*

Key idea: **BST + inorder traversal = sorted order.** Most of these problems are that one fact in disguise.

- **The climb (warm-up):** Search in a Binary Search Tree (700), Insert into a Binary Search Tree (701), Lowest Common Ancestor of a Binary Search Tree (235), Convert Sorted Array to Binary Search Tree (108)
- **The dragons (medium):** Kth Smallest Element in a BST (230), Two Sum IV - Input is a BST (653), Delete Node in a BST (450), Binary Search Tree Iterator (173)
- **Mini-boss:** Recover Binary Search Tree (99). The follow-up asks for O(1) space (Morris traversal).
- **Hidden boss, the Nameless King: Count of Smaller Numbers After Self (315).** Solvable with an augmented BST, merge sort, or a Fenwick tree. Don't attempt before finishing Area 8.

Hidden boss rules: it doesn't count toward main progress, there's no time pressure, and reading the solution isn't a failure.

## Pacing

| Phase | Problems | Approx. time (2/day) |
|---|---|---|
| Areas 1-4 | ~44 | 3 weeks |
| Areas 5-8 | ~43 | 3 weeks |
| Bonfire revisits | ~8 | spread throughout |
| Archdragon Peak (optional) | 10 | 5 days |
