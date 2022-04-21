import matplotlib.pyplot as plt
import numpy as np

y1 = np.array([60.65, 10.38, 3.83])
mylabels1 = ["For Our Children (SNS) - 60.65%", "SPS - 10.38%", "Serbian Political Alliance - 3.83%"]
colors1 = ["blue", "red", "gray"]
y2 = np.array([44.22, 14.12, 11.77, 5.55, 4.85, 3.93, 3.83])
mylabels2 = ["Together We Can Do Everything (SNS) - 44.22%", "United for the Victory of Serbia - 14.12%", "SPS - 11.77%", "National Democratic Alternative - 5.55%", "We Must - 4.85%", "DVERI-POKS - 3.93%", "Serbian Party Oathkeepers - 3.83%"]
colors2 = ["blue", "yellow", "red", "cyan", "green", "purple", "pink"]

f, (ax1, ax2) = plt.subplots(1, 2)
ax1.pie(y1, colors = colors1)
ax1.legend(labels = mylabels1, loc = 'best', prop={'size': 6})
ax1.set_title("Serbian Parliamentary Elections 2020")
#ax1.title("Serbian Parliamentary Elections 2020")
ax2.pie(y2, colors = colors2)
ax2.legend(labels = mylabels2, loc = 'best', prop={'size': 5})
ax2.set_title("Serbian Parliamentary Elections 2022")
#ax2.title("Serbian Parliamentary Elections 2022")
plt.subplots_adjust(wspace=0.8)
plt.show() 