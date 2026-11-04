// Preloaded comprehensive dataset for Sahyadri Placement Hub
// Contains 20 full exams (with 3 sample demo tests), questions, weekly newsletters, recruiters, jobs, and study materials

const seedData = {
  users: [
    {
      id: "usr_student_sanvith",
      name: "Sanvith S Rai",
      email: "sanvith.rai.ci24@sahyadri.edu.in",
      password: "$2a$10$w/xGq5aM8U9Zk6C2wF9SLeVb9YlD6rL/aA9nKkQ8P2uLw4d2yv5i6", // bcrypt hash for 'SAHYADRI'
      role: "student",
      usn: "4SF24CI147",
      branch: "Computer Science & Engineering-AI&ML",
      semester: 5,
      cgpa: 8.05,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    {
      id: "usr_admin_rashmi",
      name: "Prof. Rashmi Bhandary",
      email: "admin@sahyadri.edu.in",
      password: "$2a$10$w/xGq5aM8U9Zk6C2wF9SLeVb9YlD6rL/aA9nKkQ8P2uLw4d2yv5i6", // 'SAHYADRI'
      role: "faculty",
      usn: "FAC_PL_001",
      branch: "Career Guidance, Training & Placement Cell",
      semester: 0,
      cgpa: 10.0,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    }
  ],

  exams: [
    // 3 Sample Demo Tests for immediate demo
    {
      id: "exam_demo_01",
      title: "Sample Demo: Quantitative Aptitude Quick Test",
      category: "Demo",
      subcategory: "Aptitude",
      description: "Fast-track 5-question numerical reasoning test to evaluate speed, ratios, and percentages. Ideal for quick practice before full tests.",
      duration_minutes: 10,
      total_marks: 25,
      passing_marks: 15,
      difficulty: "Easy",
      is_demo: true,
      banner_gradient: "linear-gradient(135deg, #e50914, #210e17)"
    },
    {
      id: "exam_demo_02",
      title: "Sample Demo: Logical Reasoning & Pattern Recognition",
      category: "Demo",
      subcategory: "Logical",
      description: "Quick diagnostic test covering number series, syllogisms, and directional sense required by top IT recruiters.",
      duration_minutes: 10,
      total_marks: 25,
      passing_marks: 15,
      difficulty: "Medium",
      is_demo: true,
      banner_gradient: "linear-gradient(135deg, #192247, #e50914)"
    },
    {
      id: "exam_demo_03",
      title: "Sample Demo: Japanese JLPT N5 Quick Assessment",
      category: "Demo",
      subcategory: "Japanese",
      description: "Official Sahyadri Japan Connect demo evaluation. Covers basic Hiragana, Katakana, everyday vocabulary, and conversational greetings for Japanese recruiters (Belc, IMV, Aisan).",
      duration_minutes: 10,
      total_marks: 25,
      passing_marks: 15,
      difficulty: "Easy",
      is_demo: true,
      banner_gradient: "linear-gradient(135deg, #b80710, #192247)"
    },

    // 17 Full Placement Exams (Total 20)
    {
      id: "exam_apt_01",
      title: "Quantitative Aptitude: Numbers, HCF-LCM & Divisibility",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "Comprehensive exam on number theory, remainder theorem, unit digit calculation, and divisibility rules frequently asked in TCS, Infosys, and Cognizant.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_apt_02",
      title: "Quantitative Aptitude: Percentages, Profit & Loss",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "Evaluate discount calculation, successive markup, cost price vs selling price scenarios, and margin estimation.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_apt_03",
      title: "Quantitative Aptitude: Time, Speed & Distance (Trains & Boats)",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "Relative speed equations, upstream-downstream streams, circular tracks, and average speed problems.",
      duration_minutes: 35,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Hard",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_apt_04",
      title: "Quantitative Aptitude: Time, Work & Pipes-Cisterns",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "Unitary work calculations, efficiency comparisons, alternating hours, and leak dynamics.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_apt_05",
      title: "Quantitative Aptitude: Permutations, Combinations & Probability",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "Conditional probability, dice/card scenarios, combinatorial selections, and arrangement constraints.",
      duration_minutes: 35,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Hard",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_apt_06",
      title: "Quantitative Aptitude: Data Interpretation & Charts",
      category: "Aptitude",
      subcategory: "Quantitative",
      description: "High-speed analytical reading of Bar Graphs, Pie Charts, Radar charts, and Tabular numerical data.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_log_01",
      title: "Logical Reasoning: Syllogisms & Venn Diagrams",
      category: "Aptitude",
      subcategory: "Logical",
      description: "Deductive logic questions with statements and conclusions. Test validity of categorical arguments.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_log_02",
      title: "Logical Reasoning: Blood Relations & Direction Sense",
      category: "Aptitude",
      subcategory: "Logical",
      description: "Multi-generation family tree relations, coded symbols (A+B means father), and coordinate displacement problems.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Easy",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_log_03",
      title: "Logical Reasoning: Seating Arrangement & Grid Puzzles",
      category: "Aptitude",
      subcategory: "Logical",
      description: "Linear and circular seating facing center/outward, multi-variable matching puzzles tested in high-paying hiring drives.",
      duration_minutes: 40,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Hard",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_vbl_01",
      title: "Verbal Ability: Reading Comprehension & Inferences",
      category: "Aptitude",
      subcategory: "Verbal",
      description: "Passage reading, central theme identification, tone analysis, and vocabulary in context.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_vbl_02",
      title: "Verbal Ability: Sentence Correction & Error Spotting",
      category: "Aptitude",
      subcategory: "Verbal",
      description: "Subject-verb agreement, modifier placement, tense consistency, and idiomatic correctness.",
      duration_minutes: 25,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Easy",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_tech_01",
      title: "Technical: Data Structures & Algorithms Core",
      category: "Technical",
      subcategory: "Computer Science",
      description: "Time & Space complexity, Tree traversals, Graph BFS/DFS, Heaps, and Dynamic Programming fundamentals.",
      duration_minutes: 35,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Hard",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_tech_02",
      title: "Technical: DBMS & Relational SQL Queries",
      category: "Technical",
      subcategory: "Computer Science",
      description: "ACID properties, Normalization (1NF to BCNF), indexing, complex Joins, Subqueries, and transaction isolation.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_tech_03",
      title: "Technical: Operating Systems & System Programming",
      category: "Technical",
      subcategory: "Computer Science",
      description: "Process scheduling algorithms, Deadlock detection, Virtual Memory paging, and Semaphores vs Mutex.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #192247, #210e17)"
    },
    {
      id: "exam_jpn_01",
      title: "Japanese Language: JLPT N5 Kanji & Vocabulary (漢字と語彙)",
      category: "Japanese",
      subcategory: "JLPT N5",
      description: "Foundational 100 Kanji characters, onyomi/kunyomi readings, counter suffixes, and essential nouns for Sahyadri's Japan placement drive.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Easy",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #b80710, #192247)"
    },
    {
      id: "exam_jpn_02",
      title: "Japanese Language: JLPT N5 Grammar & Particles (文法と助詞)",
      category: "Japanese",
      subcategory: "JLPT N5",
      description: "Mastery of Japanese sentence structure, particle usage (は, が, を, に, で, へ), te-form verbs, and desire expressions (-tai).",
      duration_minutes: 35,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #b80710, #192247)"
    },
    {
      id: "exam_jpn_03",
      title: "Japanese Language: Corporate Culture & Business Etiquette (ビジネス敬語)",
      category: "Japanese",
      subcategory: "Business Japanese",
      description: "Essential Keigo (honorifics), formal meeting intros (Jikoshoukai), bowing culture, and client communication tested by Belc and IMV Corporation.",
      duration_minutes: 30,
      total_marks: 50,
      passing_marks: 30,
      difficulty: "Medium",
      is_demo: false,
      banner_gradient: "linear-gradient(149deg, #b80710, #192247)"
    }
  ],

  questions: [
    // Questions for exam_demo_01: Sample Demo Quantitative Aptitude
    {
      id: "q_demo1_1",
      exam_id: "exam_demo_01",
      question_text: "A shopkeeper sells an article at ₹840 after offering a 20% discount on the marked price. If he makes a 20% profit on the cost price, what is the cost price?",
      option_a: "₹650",
      option_b: "₹700",
      option_c: "₹720",
      option_d: "₹750",
      correct_option: "B",
      explanation: "Marked Price = 840 / 0.8 = ₹1050. Selling Price = ₹840. With 20% profit: CP * 1.20 = 840 => CP = 840 / 1.2 = ₹700.",
      marks: 5,
      order_index: 1
    },
    {
      id: "q_demo1_2",
      exam_id: "exam_demo_01",
      question_text: "If a train 150 meters long crosses a pole in 9 seconds, what is the speed of the train in km/h?",
      option_a: "50 km/h",
      option_b: "54 km/h",
      option_c: "60 km/h",
      option_d: "72 km/h",
      correct_option: "C",
      explanation: "Speed = Distance / Time = 150m / 9s = 50/3 m/s. Convert to km/h: (50/3) * (18/5) = 10 * 6 = 60 km/h.",
      marks: 5,
      order_index: 2
    },
    {
      id: "q_demo1_3",
      exam_id: "exam_demo_01",
      question_text: "The ratio of ages of A and B is 3 : 5. After 6 years, the ratio of their ages becomes 2 : 3. What is the present age of A?",
      option_a: "18 years",
      option_b: "24 years",
      option_c: "30 years",
      option_d: "15 years",
      correct_option: "A",
      explanation: "Let ages be 3x and 5x. (3x + 6) / (5x + 6) = 2/3 => 3(3x + 6) = 2(5x + 6) => 9x + 18 = 10x + 12 => x = 6. Present age of A = 3 * 6 = 18 years.",
      marks: 5,
      order_index: 3
    },
    {
      id: "q_demo1_4",
      exam_id: "exam_demo_01",
      question_text: "What is the unit digit in the expansion of 7^105?",
      option_a: "1",
      option_b: "3",
      option_c: "7",
      option_d: "9",
      correct_option: "C",
      explanation: "Powers of 7 follow cyclicity of 4: 7^1 = 7, 7^2 = 9, 7^3 = 3, 7^4 = 1. 105 mod 4 = 1. Therefore, unit digit is 7^1 = 7.",
      marks: 5,
      order_index: 4
    },
    {
      id: "q_demo1_5",
      exam_id: "exam_demo_01",
      question_text: "A and B can do a piece of work in 12 days and 18 days respectively. If they work together for 4 days, what fraction of work is left?",
      option_a: "5/9",
      option_b: "4/9",
      option_c: "1/3",
      option_d: "2/5",
      correct_option: "B",
      explanation: "1-day work = 1/12 + 1/18 = (3+2)/36 = 5/36. In 4 days, work completed = 4 * (5/36) = 20/36 = 5/9. Work remaining = 1 - 5/9 = 4/9.",
      marks: 5,
      order_index: 5
    },

    // Questions for exam_demo_02: Sample Demo Logical Reasoning
    {
      id: "q_demo2_1",
      exam_id: "exam_demo_02",
      question_text: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
      option_a: "95",
      option_b: "127",
      option_c: "125",
      option_d: "119",
      correct_option: "B",
      explanation: "Pattern: Each term is 2n + 1 or previous term + powers of 2 (4, 8, 16, 32, 64). 63 * 2 + 1 = 127.",
      marks: 5,
      order_index: 1
    },
    {
      id: "q_demo2_2",
      exam_id: "exam_demo_02",
      question_text: "Statements: All laptops are electronic. Some electronics are durable. Conclusions: I. Some laptops are durable. II. All durable are laptops.",
      option_a: "Only conclusion I follows",
      option_b: "Only conclusion II follows",
      option_c: "Neither I nor II follows",
      option_d: "Both I and II follow",
      correct_option: "C",
      explanation: "The connection between laptops and durable is mediated only through 'Some electronics', which cannot guarantee overlap between laptops and durable. Hence neither follows.",
      marks: 5,
      order_index: 2
    },
    {
      id: "q_demo2_3",
      exam_id: "exam_demo_02",
      question_text: "Pointing to a man, a woman said: 'His mother is the only daughter of my mother.' How is the woman related to the man?",
      option_a: "Sister",
      option_b: "Mother",
      option_c: "Aunt",
      option_d: "Grandmother",
      correct_option: "B",
      explanation: "'Only daughter of my mother' is the woman herself. So the woman is the mother of the man.",
      marks: 5,
      order_index: 3
    },
    {
      id: "q_demo2_4",
      exam_id: "exam_demo_02",
      question_text: "A person walks 10 km North, turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is he from the starting point?",
      option_a: "6 km East",
      option_b: "6 km West",
      option_c: "10 km South",
      option_d: "16 km North-East",
      correct_option: "A",
      explanation: "The 10 km North and 10 km South cancel out. He moved 6 km East of the vertical axis, so he is 6 km East of the origin.",
      marks: 5,
      order_index: 4
    },
    {
      id: "q_demo2_5",
      exam_id: "exam_demo_02",
      question_text: "In a certain code language, 'ROBOT' is written as 'UPERW'. How is 'SMART' written in that code?",
      option_a: "VPDUW",
      option_b: "VPEUW",
      option_c: "UODTV",
      option_d: "VQFVX",
      correct_option: "A",
      explanation: "Each letter is shifted by +3 in the English alphabet: R(+3)=U, O(+1)? Wait: R(18)->U(21) [+3], O(15)->P(16) [+1], B(2)->E(5) [+3], O(15)->R(18) [+3], T(20)->W(23) [+3]. For SMART with +3: S->V, M->P, A->D, R->U, T->W => VPDUW.",
      marks: 5,
      order_index: 5
    },

    // Questions for exam_demo_03: Sample Demo Japanese JLPT N5
    {
      id: "q_demo3_1",
      exam_id: "exam_demo_03",
      question_text: "What is the correct Hiragana reading for the Kanji '学生' (student)?",
      option_a: "せんせい (sensei)",
      option_b: "がくせい (gakusei)",
      option_c: "かいしゃいん (kaishain)",
      option_d: "ともだち (tomodachi)",
      correct_option: "B",
      explanation: "学 (gaku = study) + 生 (sei = life/person) = がくせい (gakusei), which means student.",
      marks: 5,
      order_index: 1
    },
    {
      id: "q_demo3_2",
      exam_id: "exam_demo_03",
      question_text: "Complete the sentence with the appropriate particle: わたし_____ サヒャドリ だいがく の がくせい です。(I am a student of Sahyadri University).",
      option_a: "を (wo)",
      option_b: "に (ni)",
      option_c: "は (wa)",
      option_d: "で (de)",
      correct_option: "C",
      explanation: "The topic marking particle is は (pronounced 'wa' when used as a particle). Watashi wa Sahyadri daigaku no gakusei desu.",
      marks: 5,
      order_index: 2
    },
    {
      id: "q_demo3_3",
      exam_id: "exam_demo_03",
      question_text: "When greeting an interviewer in the morning in a Japanese corporate setting, what do you say?",
      option_a: "こんばんは (Konbanwa)",
      option_b: "おはよう ございます (Ohayou gozaimasu)",
      option_c: "さようなら (Sayounara)",
      option_d: "いただきます (Itadakimasu)",
      correct_option: "B",
      explanation: "'Ohayou gozaimasu' is the polite morning greeting used in professional and academic settings.",
      marks: 5,
      order_index: 3
    },
    {
      id: "q_demo3_4",
      exam_id: "exam_demo_03",
      question_text: "What does the phrase 'よろしく おねがいします' (Yoroshiku onegaishimasu) convey in an interview?",
      option_a: "Goodbye, see you tomorrow",
      option_b: "Please treat me favorably / Nice to meet you and work with you",
      option_c: "Sorry for being late",
      option_d: "Thank you for the delicious meal",
      correct_option: "B",
      explanation: "'Yoroshiku onegaishimasu' is a fundamental phrase in Japanese business culture expressing a request for good relations and cooperation.",
      marks: 5,
      order_index: 4
    },
    {
      id: "q_demo3_5",
      exam_id: "exam_demo_03",
      question_text: "Which of the following numbers is pronounced 'なな' (nana) or 'しち' (shichi)?",
      option_a: "3",
      option_b: "5",
      option_c: "7",
      option_d: "9",
      correct_option: "C",
      explanation: "7 is pronounced 'nana' or 'shichi' in Japanese.",
      marks: 5,
      order_index: 5
    },

    // Technical Test Questions (exam_tech_01: DSA Core)
    {
      id: "q_tech1_1",
      exam_id: "exam_tech_01",
      question_text: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
      option_a: "O(1)",
      option_b: "O(log N)",
      option_c: "O(N)",
      option_d: "O(N log N)",
      correct_option: "C",
      explanation: "In a skewed (degenerate) BST where all nodes have only one child, the tree behaves like a linked list, leading to O(N) worst-case search time.",
      marks: 10,
      order_index: 1
    },
    {
      id: "q_tech1_2",
      exam_id: "exam_tech_01",
      question_text: "Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?",
      option_a: "Stack",
      option_b: "Queue",
      option_c: "Max-Heap",
      option_d: "Hash Map",
      correct_option: "B",
      explanation: "BFS explores vertices level by level, following First-In First-Out (FIFO) order, which requires a Queue data structure.",
      marks: 10,
      order_index: 2
    },
    {
      id: "q_tech1_3",
      exam_id: "exam_tech_01",
      question_text: "Given an array of N integers, what is the optimal time complexity to find the Maximum Subarray Sum (Kadane's Algorithm)?",
      option_a: "O(N^2)",
      option_b: "O(N log N)",
      option_c: "O(N)",
      option_d: "O(log N)",
      correct_option: "C",
      explanation: "Kadane's algorithm iterates through the array once in linear time O(N) by keeping track of the current maximum ending at each position.",
      marks: 10,
      order_index: 3
    },
    {
      id: "q_tech1_4",
      exam_id: "exam_tech_01",
      question_text: "Which of the following sorting algorithms is inherently stable?",
      option_a: "Quick Sort",
      option_b: "Heap Sort",
      option_c: "Merge Sort",
      option_d: "Selection Sort",
      correct_option: "C",
      explanation: "Standard Merge Sort maintains the relative order of equal elements during the merge step, making it stable.",
      marks: 10,
      order_index: 4
    },
    {
      id: "q_tech1_5",
      exam_id: "exam_tech_01",
      question_text: "In Dijkstra's algorithm implemented with a Min-Priority Queue (Fibonacci/Binary Heap), what is the time complexity for a graph with V vertices and E edges?",
      option_a: "O(V^2)",
      option_b: "O((V + E) log V)",
      option_c: "O(E * V)",
      option_d: "O(V log E)",
      correct_option: "B",
      explanation: "Extract-min takes O(log V) for V vertices, and edge relaxation updates take O(log V) for E edges, yielding O((V + E) log V).",
      marks: 10,
      order_index: 5
    },

    // Japanese Test Questions (exam_jpn_01: Kanji & Vocab)
    {
      id: "q_jpn1_1",
      exam_id: "exam_jpn_01",
      question_text: "What does the Kanji '日' represent in Japanese?",
      option_a: "Moon / Month",
      option_b: "Sun / Day",
      option_c: "Tree / Wood",
      option_d: "Water",
      correct_option: "B",
      explanation: "日 (hi/nichi/bi) represents sun or day (as in 日本 = Nihon = Japan).",
      marks: 10,
      order_index: 1
    },
    {
      id: "q_jpn1_2",
      exam_id: "exam_jpn_01",
      question_text: "Choose the correct Kanji for 'company' (Kaisha):",
      option_a: "社会",
      option_b: "会社",
      option_c: "大学",
      option_d: "病院",
      correct_option: "B",
      explanation: "会 (meeting) + 社 (shrine/company) in reverse order: 会社 (Kaisha) means company. 社会 (Shakai) means society.",
      marks: 10,
      order_index: 2
    },
    {
      id: "q_jpn1_3",
      exam_id: "exam_jpn_01",
      question_text: "What is the counter suffix used for counting long cylindrical objects such as pens, bottles, and trains?",
      option_a: "〜枚 (mai)",
      option_b: "〜本 (hon/bon/pon)",
      option_c: "〜冊 (satsu)",
      option_d: "〜台 (dai)",
      correct_option: "B",
      explanation: "〜本 (hon) is used for long, slender items (pens, bottles, trees, umbrellas). 〜枚 is for flat items, 〜冊 is for books, 〜台 is for machines/cars.",
      marks: 10,
      order_index: 3
    },
    {
      id: "q_jpn1_4",
      exam_id: "exam_jpn_01",
      question_text: "In Japanese business culture, what is the term for reporting, contacting, and consulting with superiors (Ho-Ren-So)?",
      option_a: "ほうれんそう (Hōkoku, Renraku, Sōdan)",
      option_b: "かいぜん (Kaizen)",
      option_c: "じどうしゃ (Jidousha)",
      option_d: "めいし (Meishi)",
      correct_option: "A",
      explanation: "Ho-Ren-So is an acronym for 報告 (Hōkoku - Report), 連絡 (Renraku - Communicate), and 相談 (Sōdan - Consult), a cornerstone of Japanese workplace synergy.",
      marks: 10,
      order_index: 4
    },
    {
      id: "q_jpn1_5",
      exam_id: "exam_jpn_01",
      question_text: "What does 'エンジニア' (Enjinia) mean in Katakana?",
      option_a: "Engine",
      option_b: "Engineer",
      option_c: "Energy",
      option_d: "English",
      correct_option: "B",
      explanation: "エンジニア is the loanword for Engineer transcribed in Katakana.",
      marks: 10,
      order_index: 5
    }
  ],

  newsletters: [
    {
      id: "nl_01",
      title: "Campus Buzz Edition 48: Japan Placement Conclave & 47.24 LPA Peak Offer",
      edition: "Vol. 2026 - Issue 12",
      publish_date: "2026-10-28",
      summary: "Inside Sahyadri's historic international recruitment drive with Belc Co., Ltd. and IMV Corporation. Highlights on Japanese language proficiency pathways, salary packages, and tips from placed seniors.",
      content: `### Sahyadri Global Connect: Japanese Recruitment Milestone
The Department of Career Guidance, Training, and Placement at Sahyadri College of Engineering & Management is delighted to present our flagship placement report for the ongoing recruitment season.

#### Key Highlights
- **Belc Co., Ltd. (Japan)** offered our highest international package of **₹47.24 LPA**, recruiting talented software and mechatronics engineers directly to Tokyo!
- **IMV Corporation & Aisan** followed with exceptional international packages of **₹36.04 LPA** and **₹34.42 LPA** respectively.
- Over **45 Sahyadrians** cleared the Zenken Japanese Language Screening with JLPT N5/N4 certifications.

#### Placement Dean's Message (Prof. Rashmi Bhandary)
"Global placement is not an accident—it is the result of systematic language training, core problem solving, and corporate etiquette training. We encourage all 3rd and 4th-year students to utilize the Japanese language test modules available right inside this portal to get placement-ready."`,
      cover_image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600",
      read_time: "4 min read",
      tags: "Placements, Japan, Belc, Salary Benchmarks"
    },
    {
      id: "nl_02",
      title: "Campus Buzz Edition 47: Cracking Microsoft, Cohesity & Product Tier Coding Rounds",
      edition: "Vol. 2026 - Issue 11",
      publish_date: "2026-10-15",
      summary: "In-depth guide to tackling online assessments (OA) and live pair-programming rounds at Microsoft, Adobe, and Cohesity with Sahyadri's Top Coders.",
      content: `### Product Companies Strategy Guide
Microsoft and Cohesity continue to recruit top-tier talent from Sahyadri with packages of ₹40 LPA and ₹24 LPA respectively. Here is what their technical panels test:

1. **Graph Algorithms & Trees**: Focus on Lowest Common Ancestor, Topological Sort, and Dynamic Programming on trees.
2. **Concurrency & Multithreading**: Operating system fundamentals like race conditions, thread synchronization, and mutexes are heavily quizzed in Cohesity rounds.
3. **Behavioral STAR Method**: Answer leadership and project complexity questions with Situation, Task, Action, and Result metrics.`,
      cover_image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
      read_time: "6 min read",
      tags: "Microsoft, Cohesity, Coding Rounds, Product Companies"
    },
    {
      id: "nl_03",
      title: "Campus Buzz Edition 46: Aptitude Arena 2026 & Speed Math Techniques",
      edition: "Vol. 2026 - Issue 10",
      publish_date: "2026-09-30",
      summary: "Highlights from the Aptitude Arena conducted across all branches. Essential Vedic Math shortcuts, digit sum tricks, and time management strategies.",
      content: `### Aptitude Mastery: Speed Meets Precision
Over 1,200 students participated in our bi-annual Aptitude Arena. The average score improved by 34% compared to last semester, showing the immense impact of continuous mock test practice.

#### Essential Tips
- Use elimination methods rather than solving the complete equation where options vary widely.
- Memorize fractional values of percentages (e.g., 1/7 = 14.28%, 1/8 = 12.5%, 1/12 = 8.33%) to speed up calculations.`,
      cover_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
      read_time: "5 min read",
      tags: "Aptitude, Speed Math, Aptitude Arena"
    }
  ],

  jobs: [
    {
      id: "job_01",
      company: "Microsoft",
      role: "Software Engineering Intern / Full-Time Graduate (2026 Batch)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      ctc: "₹40.0 - ₹44.0 LPA",
      location: "Bengaluru / Hyderabad",
      deadline: "2026-11-20",
      apply_url: "https://careers.microsoft.com",
      eligibility: "B.E / B.Tech (CS, IS, EC, AI/ML), CGPA >= 7.5, No active backlogs",
      description: "Design and implement scalable distributed cloud services on Azure, AI infrastructure, and Windows core. Candidates must have strong problem solving in C++, Java, or C#.",
      type: "Full Time + Internship",
      is_verified: true
    },
    {
      id: "job_02",
      company: "Belc Co., Ltd. (Tokyo, Japan)",
      role: "Global Systems Engineer / IT Solutions Analyst",
      logo: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=100",
      ctc: "¥8,500,000 (~ ₹47.24 LPA)",
      location: "Tokyo, Japan",
      deadline: "2026-11-25",
      apply_url: "https://sahyadri.edu.in/placements",
      eligibility: "All B.E Engineering Branches, JLPT N5 minimum or enrolled in Sahyadri Japanese Training, CGPA >= 7.0",
      description: "Direct international deployment to Belc headquarters in Japan. Full relocation support, corporate Japanese language immersion, and competitive global compensation.",
      type: "International Full Time",
      is_verified: true
    },
    {
      id: "job_03",
      company: "Cohesity",
      role: "Member of Technical Staff - Storage & Cloud Systems",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100",
      ctc: "₹24.0 LPA",
      location: "Bengaluru, Karnataka",
      deadline: "2026-11-18",
      apply_url: "https://www.cohesity.com/company/careers/",
      eligibility: "CSE / ISE / AI&DS, CGPA >= 8.0, Strong Systems Programming",
      description: "Work on next-generation hyperscale data management, cybersecurity, and zero-trust cloud architectures. Deep knowledge of C/C++, Linux kernel, and file systems required.",
      type: "Full Time",
      is_verified: true
    },
    {
      id: "job_04",
      company: "IMV Corporation (Japan)",
      role: "Mechatronics & Embedded Software Developer",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100",
      ctc: "¥6,500,000 (~ ₹36.04 LPA)",
      location: "Osaka, Japan",
      deadline: "2026-12-05",
      apply_url: "https://sahyadri.edu.in/placements",
      eligibility: "B.E in Mechanical, Mechatronics, ECE, CS. Basic Japanese communication.",
      description: "Pioneering vibration simulation and environmental testing hardware and automation controllers. High growth international career pathway.",
      type: "International Full Time",
      is_verified: true
    },
    {
      id: "job_05",
      company: "Adobe",
      role: "Associate Software Engineer - Creative Cloud",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
      ctc: "₹27.7 LPA",
      location: "Noida / Bengaluru",
      deadline: "2026-11-30",
      apply_url: "https://www.adobe.com/careers.html",
      eligibility: "B.E / B.Tech (CS / IT / Circuital), CGPA >= 7.8",
      description: "Build cutting-edge graphics processing, AI generative features, and web-scale collaborative tools for millions of digital creators worldwide.",
      type: "Full Time",
      is_verified: true
    },
    {
      id: "job_06",
      company: "Accolite Digital / Birlasoft",
      role: "Associate Software Development Engineer",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100",
      ctc: "₹8.0 - ₹11.0 LPA",
      location: "Bengaluru / Hyderabad",
      deadline: "2026-11-22",
      apply_url: "https://www.accolite.com/careers",
      eligibility: "All Circuit Branches, CGPA >= 6.5, Excellent Aptitude & Java/Python",
      description: "Fintech, healthcare, and enterprise digital transformation projects. Robust onboarding and fast-track promotion tracks.",
      type: "Full Time",
      is_verified: true
    }
  ],

  study_materials: [
    {
      id: "mat_01",
      title: "Comprehensive Quantitative Aptitude Formula Handbook",
      category: "Aptitude",
      description: "All 18 chapters summarized: Profit & Loss, Speed-Time-Distance, Permutations, Probability, Work & Wages, and Mixtures with solved sample problems.",
      read_time: "25 min read",
      tags: "Formulas, Cheat Sheet, Math Shortcuts",
      download_url: "#",
      content: `### Top Formulas for Campus Placement Aptitude
1. **Speed, Distance & Time**: Average speed when distances are equal = 2xy / (x + y).
2. **Relative Speed**: Same direction = |S1 - S2|; Opposite direction = S1 + S2.
3. **Compound Interest**: A = P(1 + r/100)^n. Difference between CI and SI for 2 years = P(r/100)^2.
4. **Work & Time**: If A completes in X days and B in Y days, together they take (X * Y) / (X + Y) days.`
    },
    {
      id: "mat_02",
      title: "Sahyadri Japan Connect: JLPT N5 Essential 100 Kanji & Vocabulary Guide",
      category: "Japanese",
      description: "Curated by Sahyadri Japanese trainers. Includes strokes, onyomi, kunyomi, meaning, and business sentence examples required by Japanese recruiters.",
      read_time: "30 min read",
      tags: "JLPT N5, Kanji, Japanese, Zenken",
      download_url: "#",
      content: `### Must-Know JLPT N5 Kanji for Placement Interviews
- **人** (hito / jin): Person (例: 日本人 = Japanese person, インド人 = Indian person)
- **大** (oo / dai): Big (例: 大学 = Daigaku = University)
- **学** (gaku): Study (例: 学生 = Gakusei = Student)
- **先** (saki / sen): Previous / Ahead (例: 先生 = Sensei = Teacher)
- **会** (kai): Meeting (例: 会社 = Kaisha = Company, 会議 = Kaigi = Meeting)
- **社** (sha): Shrine / Society (例: 社長 = Shachou = Company President)`
    },
    {
      id: "mat_03",
      title: "Data Structures & Algorithms Cheat Sheet (Blind 75 & Placement Top 100)",
      category: "Technical",
      description: "Detailed pattern guide: Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Backtracking, and DP state transitions.",
      read_time: "45 min read",
      tags: "DSA, LeetCode, C++, Java, Python",
      download_url: "#",
      content: `### Algorithm Patterns Checklist
1. **Sliding Window**: Subarray with target sum, longest substring without repeating characters.
2. **Two Pointers**: Trapping rainwater, 3Sum, container with most water.
3. **Tree BFS/DFS**: Level-order traversal, maximum path sum, invert binary tree.`
    },
    {
      id: "mat_04",
      title: "HR & Technical Interview Master Guide (STAR Technique & Sahyadri FAQ)",
      category: "Interview",
      description: "Standard behavioral questions: Tell me about yourself, why this company, handling project conflicts, and salary negotiation tactics.",
      read_time: "20 min read",
      tags: "HR Round, Mock Interview, Behavioral, STAR",
      download_url: "#",
      content: `### STAR Response Architecture
- **Situation**: Set the context clearly in 2 sentences.
- **Task**: Explain the challenge or target you were responsible for.
- **Action**: Highlight the specific technologies, architectural decisions, and steps YOU executed.
- **Result**: Quantify the outcome (e.g., reduced query latency by 45%, increased accuracy to 94%).`
    }
  ],

  recruiters: [
    {
      id: "rec_01",
      name: "Belc Co., Ltd. (Japan)",
      logo: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?w=100",
      status: "Attended",
      sector: "Global Retail & Technology",
      highest_package: "₹47.24 LPA",
      avg_package: "₹45.0 LPA",
      offers_made: 12,
      visit_date: "October 2026",
      eligibility: "All B.E Engineering Branches, JLPT N5/N4",
      roles_offered: "Global Solutions Architect, Software Engineer"
    },
    {
      id: "rec_02",
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      status: "Attended",
      sector: "Cloud & Enterprise Software",
      highest_package: "₹40.00 LPA",
      avg_package: "₹28.5 LPA",
      offers_made: 14,
      visit_date: "September 2026",
      eligibility: "CSE, ISE, ECE, AI&DS (CGPA >= 7.5)",
      roles_offered: "Software Engineer, Cloud Solution Architect"
    },
    {
      id: "rec_03",
      name: "IMV Corporation (Japan)",
      logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100",
      status: "Attended",
      sector: "Vibration & Automotive Simulation",
      highest_package: "₹36.04 LPA",
      avg_package: "₹36.04 LPA",
      offers_made: 8,
      visit_date: "October 2026",
      eligibility: "Mechanical, Mechatronics, ECE, CS",
      roles_offered: "Embedded Systems Developer, Mechatronics Engineer"
    },
    {
      id: "rec_04",
      name: "Adobe",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
      status: "Attended",
      sector: "Digital Media & AI Creative Tools",
      highest_package: "₹27.70 LPA",
      avg_package: "₹22.0 LPA",
      offers_made: 6,
      visit_date: "August 2026",
      eligibility: "Circuit Branches, CGPA >= 7.8",
      roles_offered: "Associate Software Engineer, Product Developer"
    },
    {
      id: "rec_05",
      name: "Cohesity",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100",
      status: "Ongoing",
      sector: "Enterprise Cloud & Cyber Resilience",
      highest_package: "₹24.00 LPA",
      avg_package: "₹24.0 LPA",
      offers_made: 10,
      visit_date: "November 2026",
      eligibility: "CSE / ISE / AI&DS (CGPA >= 8.0)",
      roles_offered: "MTS - Storage & Distributed Cloud"
    },
    {
      id: "rec_06",
      name: "Google (Direct Off-Campus / Referral Pool)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      status: "Upcoming",
      sector: "Big Tech / Search & AI",
      highest_package: "₹38.50 LPA",
      avg_package: "₹25.0 LPA",
      offers_made: 4,
      visit_date: "December 2026",
      eligibility: "B.E All CS Branches, No active backlogs",
      roles_offered: "Software Engineering New Grad, Site Reliability Engineer"
    },
    {
      id: "rec_07",
      name: "Aisan Industry (Japan)",
      logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100",
      status: "Upcoming",
      sector: "Automotive Precision & Smart Mobility",
      highest_package: "₹34.42 LPA",
      avg_package: "₹34.0 LPA",
      offers_made: 0,
      visit_date: "November 28, 2026",
      eligibility: "Mechanical, ECE, CS, JLPT N5",
      roles_offered: "Autonomous Powertrain & Firmware Engineer"
    },
    {
      id: "rec_08",
      name: "Incture Technologies",
      logo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100",
      status: "Upcoming",
      sector: "Digital Supply Chain & Enterprise Apps",
      highest_package: "₹9.50 LPA",
      avg_package: "₹7.2 LPA",
      offers_made: 0,
      visit_date: "November 15, 2026",
      eligibility: "All Engineering Branches, CGPA >= 6.5",
      roles_offered: "Full Stack Engineer, SAP Consultant"
    }
  ],

  hackathons: [
    {
      id: "hack_01",
      title: "Smart India Hackathon (SIH 2026)",
      organizer: "Ministry of Education & AICTE",
      category: "National",
      mode: "Hybrid / Grand Finale In-Person",
      dates: "Dec 10 - Dec 12, 2026",
      prize_pool: "₹1,00,00,000 across themes",
      registration_link: "https://www.sih.gov.in",
      description: "World's biggest open innovation model. Real problem statements from 50+ government ministries and PSUs.",
      tags: "National, AICTE, SIH, Hardware & Software"
    },
    {
      id: "hack_02",
      title: "Mangalore Hacks 2026: Coastal Tech Conclave",
      organizer: "Sahyadri Centre for Innovation & Industry Association",
      category: "Regional",
      mode: "Sahyadri Campus (Campus Auditorium)",
      dates: "Nov 22 - Nov 23, 2026",
      prize_pool: "₹3,50,000 + Incubation Grants",
      registration_link: "https://sahyadri.edu.in/innovation",
      description: "36-hour hackathon focused on Coastal FinTech, Smart Agriculture, and Port Automation AI.",
      tags: "Regional, Sahyadri Campus, Incubation, AI"
    },
    {
      id: "hack_03",
      title: "IEEE Mangalore Sub-Section DevCon Hackathon",
      organizer: "IEEE SCEM Student Branch",
      category: "National",
      mode: "Online + Finals at SCEM",
      dates: "Dec 02 - Dec 04, 2026",
      prize_pool: "₹1,50,000",
      registration_link: "https://ieee.sahyadri.edu.in",
      description: "Build scalable IoT, Green Tech, and Cybersecurity applications with industry mentors.",
      tags: "IEEE, IoT, Cybersecurity"
    },
    {
      id: "hack_04",
      title: "Flipkart GRiD 7.0 - Campus Tech Challenge",
      organizer: "Flipkart Commerce",
      category: "National",
      mode: "Online",
      dates: "Nov 15 - Dec 05, 2026",
      prize_pool: "₹5,00,000 + PPI for SDE Roles",
      registration_link: "https://unstop.com/hackathons/flipkart-grid",
      description: "Flagship engineering challenge covering GenAI, Supply Chain Optimization, and Robotics.",
      tags: "Unstop, E-Commerce, SDE Hiring, PPI"
    }
  ]
};

module.exports = seedData;
