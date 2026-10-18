class FormulaEntity {
  final String id;
  final String subjectId;
  final String chapterName;
  final String title;
  final String latexExpression;
  final String description;
  final List<String> keyVariables;
  final bool isHighYield;

  const FormulaEntity({
    required this.id,
    required this.subjectId,
    required this.chapterName,
    required this.title,
    required this.latexExpression,
    required this.description,
    required this.keyVariables,
    this.isHighYield = true,
  });

  static const List<FormulaEntity> defaultFormulas = [
    // --- Physics ---
    FormulaEntity(
      id: 'f_phy_01',
      subjectId: 'physics',
      chapterName: 'Electrostatics',
      title: 'Coulomb\'s Law in Vector Form',
      latexExpression: r'\vec{F} = \frac{1}{4\pi\varepsilon_0}\frac{q_1 q_2}{r^2}\hat{r}',
      description: 'Electrostatic force between two stationary point charges in vacuum.',
      keyVariables: [r'\varepsilon_0 = 8.854 \times 10^{-12} \, \text{F/m}', 'r = distance between charges'],
    ),
    FormulaEntity(
      id: 'f_phy_02',
      subjectId: 'physics',
      chapterName: 'Current Electricity',
      title: 'Drift Velocity & Mobility',
      latexExpression: r'v_d = \frac{e E \tau}{m}, \quad I = n e A v_d',
      description: 'Relation between electric current, carrier density, drift velocity, and relaxation time.',
      keyVariables: ['n = free electron density', r'\tau = relaxation time', 'A = cross-sectional area'],
    ),
    FormulaEntity(
      id: 'f_phy_03',
      subjectId: 'physics',
      chapterName: 'Thermodynamics',
      title: 'Carnot Engine Efficiency',
      latexExpression: r'\eta = 1 - \frac{T_2}{T_1} = \frac{W}{Q_1}',
      description: 'Maximum theoretical efficiency of a reversible heat engine operating between temperatures T1 and T2.',
      keyVariables: ['T_1 = source temp (K)', 'T_2 = sink temp (K)'],
    ),
    FormulaEntity(
      id: 'f_phy_04',
      subjectId: 'physics',
      chapterName: 'Modern Physics',
      title: 'Photoelectric Equation (Einstein)',
      latexExpression: r'K_{\max} = h\nu - \phi_0 = e V_0',
      description: 'Energy conservation in photoelectric effect with stopping potential V0.',
      keyVariables: [r'\phi_0 = work function', 'V_0 = stopping potential', 'h = Planck constant'],
    ),
    FormulaEntity(
      id: 'f_phy_05',
      subjectId: 'physics',
      chapterName: 'Ray Optics',
      title: 'Lens Maker\'s Formula',
      latexExpression: r'\frac{1}{f} = (\mu - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right)',
      description: 'Focal length calculation for a thin spherical lens with refractive index μ.',
      keyVariables: ['R_1, R_2 = radii of curvature', r'\mu = relative refractive index'],
    ),

    // --- Chemistry ---
    FormulaEntity(
      id: 'f_chem_01',
      subjectId: 'chemistry',
      chapterName: 'Electrochemistry',
      title: 'Nernst Equation (at 298 K)',
      latexExpression: r'E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{0.0591}{n}\log_{10} Q',
      description: 'Cell potential under non-standard conditions as a function of reaction quotient Q.',
      keyVariables: ['n = moles of electrons transferred', 'Q = reaction quotient'],
    ),
    FormulaEntity(
      id: 'f_chem_02',
      subjectId: 'chemistry',
      chapterName: 'Chemical Kinetics',
      title: 'First-Order Integrated Rate Law',
      latexExpression: r'k = \frac{2.303}{t}\log_{10}\left(\frac{[A]_0}{[A]}\right), \quad t_{1/2} = \frac{0.693}{k}',
      description: 'Rate constant and half-life relationship for first order reaction kinetics.',
      keyVariables: ['k = rate constant', '[A]_0 = initial concentration', '[A] = concentration at time t'],
    ),
    FormulaEntity(
      id: 'f_chem_03',
      subjectId: 'chemistry',
      chapterName: 'Thermodynamics',
      title: 'Gibbs-Helmholtz Equation',
      latexExpression: r'\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ = -RT\ln K_{\text{eq}}',
      description: 'Standard Gibbs free energy change and criterion for chemical spontaneity.',
      keyVariables: [r'\Delta G < 0 \implies \text{Spontaneous}', 'K_{\text{eq}} = \text{Equilibrium constant}'],
    ),
    FormulaEntity(
      id: 'f_chem_04',
      subjectId: 'chemistry',
      chapterName: 'Solutions',
      title: 'Raoult\'s Law & Colligative Elevation',
      latexExpression: r'\Delta T_b = i \cdot K_b \cdot m, \quad \Delta T_f = i \cdot K_f \cdot m',
      description: 'Elevation in boiling point and depression in freezing point with van \'t Hoff factor i.',
      keyVariables: ['i = van \'t Hoff factor', 'K_b = ebullioscopic constant', 'm = molality'],
    ),

    // --- Mathematics ---
    FormulaEntity(
      id: 'f_math_01',
      subjectId: 'mathematics',
      chapterName: 'Definite Integration',
      title: 'King\'s Property of Definite Integrals',
      latexExpression: r'\int_{a}^{b} f(x)\,dx = \int_{a}^{b} f(a + b - x)\,dx',
      description: 'Fundamental symmetry property for simplifying complex trigonometric and rational integrands.',
      keyVariables: ['Useful when f(x) + f(a+b-x) evaluates to a constant or simpler expression.'],
    ),
    FormulaEntity(
      id: 'f_math_02',
      subjectId: 'mathematics',
      chapterName: 'Matrices & Determinants',
      title: 'Properties of Adjoint & Inverse',
      latexExpression: r'A \cdot (\text{adj}\,A) = |A|I_n, \quad |\text{adj}\,A| = |A|^{n-1}',
      description: 'Determinant relations for adjoint and adj(adj(A)) for n x n square matrices.',
      keyVariables: [r'|\text{adj}(\text{adj}\,A)| = |A|^{(n-1)^2}', r'A^{-1} = \frac{\text{adj}\,A}{|A|}'],
    ),
    FormulaEntity(
      id: 'f_math_03',
      subjectId: 'mathematics',
      chapterName: 'Coordinate Geometry',
      title: 'Perpendicular Distance from Point to Line',
      latexExpression: r'd = \frac{|a x_1 + b y_1 + c|}{\sqrt{a^2 + b^2}}',
      description: 'Shortest Euclidean distance from point (x1, y1) to line ax + by + c = 0.',
      keyVariables: ['Distance between parallel lines: d = |c1 - c2| / sqrt(a^2 + b^2)'],
    ),
    FormulaEntity(
      id: 'f_math_04',
      subjectId: 'mathematics',
      chapterName: 'Vectors & 3D Geometry',
      title: 'Shortest Distance Between Skew Lines',
      latexExpression: r'd = \left|\frac{(\vec{a}_2 - \vec{a}_1)\cdot(\vec{b}_1 \times \vec{b}_2)}{|\vec{b}_1 \times \vec{b}_2|}\right|',
      description: 'Shortest perpendicular distance between non-intersecting, non-parallel 3D lines.',
      keyVariables: [r'\vec{r} = \vec{a}_1 + \lambda \vec{b}_1', r'\vec{r} = \vec{a}_2 + \mu \vec{b}_2'],
    ),

    // --- Biology ---
    FormulaEntity(
      id: 'f_bio_01',
      subjectId: 'biology',
      chapterName: 'Genetics',
      title: 'Hardy-Weinberg Equilibrium',
      latexExpression: r'p^2 + 2pq + q^2 = 1, \quad p + q = 1',
      description: 'Allele and genotype frequencies in a large, random-mating population in the absence of evolutionary influences.',
      keyVariables: ['p = frequency of dominant allele', 'q = frequency of recessive allele', '2pq = heterozygous genotype frequency'],
    ),
    FormulaEntity(
      id: 'f_bio_02',
      subjectId: 'biology',
      chapterName: 'Ecology',
      title: 'Logistic Population Growth',
      latexExpression: r'\frac{dN}{dt} = rN\left(\frac{K - N}{K}\right)',
      description: 'Verhulst-Pearl Logistic Growth equation accounting for environmental carrying capacity K.',
      keyVariables: ['r = intrinsic rate of natural increase', 'K = carrying capacity', 'N = population density at time t'],
    ),
  ];
}
