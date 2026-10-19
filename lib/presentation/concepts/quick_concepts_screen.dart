import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_typography.dart';
import '../common/katex_math_view.dart';

class ConceptItem {
  final String id;
  final String subject;
  final String chapter;
  final String title;
  final String formulaKaTeX;
  final String explanation;
  final String commonTrap;

  const ConceptItem({
    required this.id,
    required this.subject,
    required this.chapter,
    required this.title,
    required this.formulaKaTeX,
    required this.explanation,
    required this.commonTrap,
  });
}

class QuickConceptsScreen extends StatefulWidget {
  const QuickConceptsScreen({super.key});

  @override
  State<QuickConceptsScreen> createState() => _QuickConceptsScreenState();
}

class _QuickConceptsScreenState extends State<QuickConceptsScreen> {
  String _selectedSubject = 'all';
  String _searchQuery = '';

  static const List<ConceptItem> concepts = [
    ConceptItem(
      id: 'qc_1',
      subject: 'physics',
      chapter: 'Thermodynamics',
      title: 'Carnot Engine Efficiency',
      formulaKaTeX: r'\eta = 1 - \frac{T_C}{T_H} = \frac{W}{Q_H}',
      explanation: 'Maximum theoretical efficiency possible for any heat engine operating between temperatures T_H and T_C.',
      commonTrap: 'Temperatures MUST be converted to Kelvin! Using Celsius causes an incorrect calculation.',
    ),
    ConceptItem(
      id: 'qc_2',
      subject: 'physics',
      chapter: 'Electrostatics',
      title: 'Electric Flux (Gauss Law)',
      formulaKaTeX: r'\Phi_E = \oint \vec{E} \cdot d\vec{A} = \frac{q_{\text{enclosed}}}{\varepsilon_0}',
      explanation: 'The net outward normal electric flux through any closed Gaussian surface equals enclosed charge divided by permittivity.',
      commonTrap: 'Only charges INSIDE the closed surface contribute to net flux. External charges contribute zero net flux.',
    ),
    ConceptItem(
      id: 'qc_3',
      subject: 'chemistry',
      chapter: 'Chemical Kinetics',
      title: 'Arrhenius Equation',
      formulaKaTeX: r'k = A e^{-\frac{E_a}{RT}} \implies \ln\left(\frac{k_2}{k_1}\right) = \frac{E_a}{R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right)',
      explanation: 'Relates temperature and activation energy (E_a) to the chemical rate constant k.',
      commonTrap: 'Check units of R (8.314 J/(mol·K)) vs E_a (usually given in kJ/mol). Multiply by 1000 if needed!',
    ),
    ConceptItem(
      id: 'qc_4',
      subject: 'chemistry',
      chapter: 'Electrochemistry',
      title: 'Nernst Equation at 298 K',
      formulaKaTeX: r'E_{\text{cell}} = E^\circ_{\text{cell}} - \frac{0.0591}{n} \log Q',
      explanation: 'Calculates non-standard reduction potential given reaction quotient Q and electron transfer number n.',
      commonTrap: 'Ensure pure solids and pure liquids have activity 1 and are excluded from the reaction quotient Q.',
    ),
    ConceptItem(
      id: 'qc_5',
      subject: 'mathematics',
      chapter: 'Definite Integration',
      title: 'King Property (Reflection Rule)',
      formulaKaTeX: r'\int_a^b f(x) \, dx = \int_a^b f(a + b - x) \, dx',
      explanation: 'Symmetry rule used to evaluate difficult trigonometric and rational definite integrals by adding I + I = 2I.',
      commonTrap: 'Do not forget to divide the final result by 2 after adding the original integral and transformed integral!',
    ),
    ConceptItem(
      id: 'qc_6',
      subject: 'mathematics',
      chapter: 'Matrices & Determinants',
      title: 'Determinant of Adjoint',
      formulaKaTeX: r'|\text{adj}(A)| = |A|^{n-1}, \quad |\text{adj}(\text{adj}(A))| = |A|^{(n-1)^2}',
      explanation: 'Calculates determinants of adjoint and double-adjoint matrices of order n without explicit matrix expansion.',
      commonTrap: 'Remember the power is (n - 1) for single adjoint and (n - 1)^2 for double adjoint of an n x n square matrix.',
    ),
  ];

  List<ConceptItem> get _filteredConcepts {
    return concepts.where((item) {
      final matchesSubject = _selectedSubject == 'all' || item.subject == _selectedSubject;
      final matchesQuery = _searchQuery.isEmpty ||
          item.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item.chapter.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item.explanation.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesSubject && matchesQuery;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textPrimary = isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary;
    final textSecondary = isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;

    final list = _filteredConcepts;

    return Scaffold(
      appBar: AppBar(
        title: Text('Quick Concepts', style: AppTypography.headlineSmall(textPrimary)),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Cupertino Search Text Field
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: CupertinoSearchTextField(
              placeholder: 'Search concepts, chapters, or formulas...',
              style: AppTypography.bodyMedium(textPrimary),
              onChanged: (val) => setState(() => _searchQuery = val.trim()),
            ),
          ),
          const SizedBox(height: 12),

          // Subject Sliding Segmented Control
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              width: double.infinity,
              child: CupertinoSlidingSegmentedControl<String>(
                groupValue: _selectedSubject,
                children: {
                  'all': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('All', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'physics': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Physics', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'chemistry': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Chemistry', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                  'mathematics': Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Text('Math', style: AppTypography.subhead(textPrimary).copyWith(fontSize: 13)),
                  ),
                },
                onValueChanged: (val) {
                  if (val != null) {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedSubject = val);
                  }
                },
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Concepts Cards
          if (list.isEmpty)
            Padding(
              padding: const EdgeInsets.all(40),
              child: Center(
                child: Text('No concepts match your search.', style: AppTypography.subhead(textSecondary)),
              ),
            )
          else
            ...list.map((c) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkCardSurface : AppColors.lightCardSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.darkCardStroke : AppColors.lightCardStroke,
                      width: 0.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge & Chapter Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.systemBlue.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              c.subject.toUpperCase(),
                              style: AppTypography.labelSmall(AppColors.systemBlue).copyWith(fontWeight: FontWeight.w600),
                            ),
                          ),
                          Text(
                            c.chapter,
                            style: AppTypography.labelSmall(textSecondary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      // Concept Title
                      Text(c.title, style: AppTypography.titleLarge(textPrimary).copyWith(fontSize: 18)),
                      const SizedBox(height: 12),

                      // KaTeX Formula Box
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: isDark ? AppColors.darkGroupedBackground : AppColors.lightGroupedBackground,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: KaTeXMathView(
                            text: '\$\$${c.formulaKaTeX}\$\$',
                            baseStyle: AppTypography.bodyMedium(textPrimary),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Explanation
                      Text(c.explanation, style: AppTypography.bodyMedium(textPrimary)),
                      const SizedBox(height: 12),

                      // Common Exam Trap Banner
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.systemOrange.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.systemOrange.withValues(alpha: 0.3), width: 0.5),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(CupertinoIcons.exclamationmark_triangle_fill, color: AppColors.systemOrange, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: RichText(
                                text: TextSpan(
                                  children: [
                                    const TextSpan(
                                      text: 'Exam Trap: ',
                                      style: TextStyle(color: AppColors.systemOrange, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                    TextSpan(
                                      text: c.commonTrap,
                                      style: TextStyle(color: isDark ? Colors.white70 : Colors.black87, fontSize: 13, height: 1.3),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
