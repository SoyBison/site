import daft
import matplotlib.pyplot as plt
import math

pgm = daft.PGM(node_unit=1.25)
lab_opt = {"ec": "none"}

pgm.add_node('Z', r'⌘-Z', 0, 0)
pgm.add_node('X', r'⌘-X', 1, 0)
pgm.add_node('C', r'⌘-C', 2, 0)
pgm.add_node('A', r'⌘-A', 0, 1)
pgm.add_node('S', r'⌘-S', 1, 1)
pgm.add_node('D', r'⌘-D', 2, 1)
pgm.add_node('Q', r'⌘-Q', 0, 2)
pgm.add_node('W', r'⌘-W', 1, 2)
pgm.add_node('E', r'⌘-E', 2, 2)

pgm.add_node('UL', r'Upper Left', -1, 3, aspect=1.5, plot_params=lab_opt)
pgm.add_edge('Q', 'UL')
pgm.add_node('T', r'Top', 1, 2 + math.sqrt(2), aspect=1.5, plot_params=lab_opt)
pgm.add_edge('W', 'T')
pgm.add_node('UR', r'Upper Right', 3, 3, aspect=1.5, plot_params=lab_opt)
pgm.add_edge('E', 'UR')
pgm.add_node('R', r'Right', 2.5 + math.sqrt(2), 1, aspect=1, plot_params=lab_opt)
pgm.add_edge('D', 'R')
pgm.add_node('LR', r'Lower Right', 3, -1, aspect=1.5, plot_params=lab_opt)
pgm.add_edge('C', 'LR')
pgm.add_node('B', r'Bottom', 1, -math.sqrt(2), aspect=1.5, plot_params=lab_opt)
pgm.add_edge('X', 'B')
pgm.add_node('LL', r'Lower Left', -1, -1, aspect=1.5, plot_params=lab_opt)
pgm.add_edge('Z', 'LL')
pgm.add_node('L', r'Left', -.3 - math.sqrt(2), 1, aspect=1, plot_params=lab_opt)
pgm.add_edge('A', 'L')

pgm.render()

plt.savefig('../static/media/rice/tiling_keys.png', transparent=True)

