import matplotlib.pyplot as plt
from shapely.geometry import Point
import geopandas as gpd
from geopandas import GeoDataFrame
from geopy import distance
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

PoPs_raw = [
    {"location": "Mumbai",
     "lat": 19.0760,
     "long": 72.8777
    }, 
    {"location": "Sydney",
     "lat": -33.8688,
     "lon": 151.2093
    },
    {"location": "Singapore",
     "lat": 1.3521,
     "lon": 103.8198
    },
    {"location": "Tokyo",
     "lat": 35.6762,
     "lon": 139.6503
    },
    {"location": "Frankfurt",
     "lat": 50.1109,
     "lon": 8.6821
    },
    {"location": "Cedar Knolls",
     "lat": 40.8218,
     "lon": -74.4500
    },
    {"location": "Richardson",
     "lat": 32.9483,
     "lon": -96.7299
    },
    {"location": "Fremont",
     "lat": 37.5485,
     "lon": -121.9886
    },
    {"location": "London",
     "lat": 51.5072,
     "lon": 0.1276
    }
]

tinyBird = [['KGL', 1290], ['JNB', 2334], ['DUR', 1160], ['CPT', 2168], ['ALA', 1241], ['CCU', 1319], ['MAA', 1325], ['DEL', 1440], ['KWI', 1468], ['KTM', 1324], ['DOH', 1327], ['GYD', 983], ['NAG', 1070], ['NQN', 742], ['EZE', 852], ['CFC', 1978], ['POA', 649], ['BNU', 579], ['FLN', 611], ['CNF', 563], ['LIM', 897], ['GRU', 835], ['ARI', 575], ['SJO', 1124], ['GYE', 754], ['MDE', 592], ['SCL', 868], ['JDO', 1898], ['CGP', 657], ['TBS', 636], ['ULN', 538], ['QRO', 410], ['DKR', 341], ['EVN', 348], ['EBL', 360], ['GIG', 660], ['TGU', 364], ['LCA', 286], ['HFA', 282], ['TLV', 291], ['DME', 400], ['KBP', 377], ['VTE', 187], ['ICN', 222], ['YYC', 170], ['IST', 1114], ['MGM', 146], ['ARN', 392], ['MSP', 155], ['BCN', 191], ['ZAG', 135], ['MEX', 309], ['IND', 155], ['TLH', 283], ['AKL', 121], ['YVR', 265], ['MSQ', 239], ['LIS', 212], ['RIC', 126], ['BLR', 427], ['OSL', 312], ['SLC', 267], ['ATL', 683], ['HKG', 206], ['SEA', 167], ['MAD', 298], ['MIA', 203], ['WAW', 103], ['HYD', 103], ['BRU', 156], ['BKK', 358], ['LUX', 134], ['DUB', 126], ['CPH', 154], ['MEL', 135], ['VIE', 183], ['ORD', 144], ['MRS', 141], ['GVA', 108], ['MXP', 191], ['YYZ', 157], ['IAH', 275], ['YUL', 101], ['LAX', 111], ['HAM', 121], ['MAN', 299], ['AMS', 160], ['MUC', 94], ['BOM', 1111], ['CDG', 155], ['DUS', 88], ['DFW', 37], ['KIX', 117], ['ZRH', 47], ['IAD', 78], ['SJC', 136], ['SYD', 330], ['EWR', 87], ['NRT', 123]]

airports_all = pd.read_csv("/Users/lukaklincarevic/Downloads/airport-codes_csv.csv")
airports_noclosed = airports_all[airports_all['type'] != 'closed']

airports_match = []
for i in tinyBird:
    if i[0] in list(airports_noclosed['iata_code']):
        airports_match.append(airports_noclosed[airports_noclosed['iata_code'] == i[0]].values.tolist())

flat_list = [item for sublist in airports_match for item in sublist]

coordinates = []
for i in flat_list:
    coordinates.append(i[11])

data_raw = []
for i, j in enumerate(tinyBird):
    a = j
    a.append(coordinates[i])
    data_raw.append(a)

tuples = []
for i, j in enumerate(data_raw):
    tuples.append(tuple(data_raw[i][2].split(", ")))

data = []
for i, j in enumerate(tuples):
    data.append([data_raw[i][0], data_raw[i][1], (j[1], j[0])])

PoPs = []
for i in PoPs_raw:
    PoPs.append([list(i.values())[0], (list(i.values())[1], list(i.values())[2])])

def closest_pop(loc, pops):
    all_distances = []
    for i in pops:
        all_distances.append(distance.distance(loc[2], i[1]).km)
    return((min(all_distances), pops[np.argmin(all_distances)][0]))

closest_pops = []
for i in data:
    closest_pops.append(closest_pop(i, PoPs))

x = []
for i, j in enumerate(closest_pops):
    x.append([data[i][0], data[i][1], j[0], j[1]])

x = pd.DataFrame(x)
x.set_axis(['Request Location', 'Latency', 'Distance', 'Closest PoP'], axis=1, inplace=True)

mumbai = x[x['Closest PoP'] == "Mumbai"]
sydney = x[x['Closest PoP'] == "Sydney"]
singapore = x[x['Closest PoP'] == "Singapore"]
frankfurt = x[x['Closest PoP'] == "Frankfurt"]
cedar = x[x['Closest PoP'] == "Cedar Knolls"]
tokyo = x[x['Closest PoP'] == "Tokyo"]
fremont = x[x['Closest PoP'] == "Fremont"]
richardson = x[x['Closest PoP'] == "Richardson"]
london = x[x['Closest PoP'] == "London"]
x_pops = [mumbai, sydney, singapore, tokyo, frankfurt, cedar, richardson, fremont, london]

results = []
for i, j in enumerate(x_pops):
    model = LinearRegression()
    model.fit(X = np.array(j['Distance']).reshape((-1, 1)), y = np.array(j['Latency']))
    results.append([PoPs[i][0], float(model.coef_), model.intercept_])

results = pd.DataFrame(results)
results.set_axis(['PoP', 'Slope [ms/km]', 'Intercept [ms]'], axis=1, inplace=True)
print(results)

inputs = []
for i in data:
    if i[1] < 100:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "< 100"])
    if i[1] >= 100 and i[1] < 200:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "100 - 200"])
    if i[1] >= 200 and i[1] < 500:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "200 - 500"])
    if i[1] >= 500 and i[1] < 1000:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "500 - 1000"])
    if i[1] >= 1000 and i[1] < 1500:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "1000 - 1500"])
    if i[1] >= 1500:
        inputs.append([float(i[2][1]), float(i[2][0]), i[0], "> 1500"])
for i in PoPs:
    inputs.append([i[1][1], i[1][0], i[0], "PoP"])


df = pd.DataFrame(inputs)
df.set_axis(['x', 'y', 'Name', 'Category'], axis=1, inplace=True)

pops_df = df[df["Category"] == "PoP"]
df_0 = df[df["Category"] == "< 100"]
df_100 = df[df["Category"] == "100 - 200"]
df_200 = df[df["Category"] == "200 - 500"]
df_500 = df[df["Category"] == "500 - 1000"]
df_1000 = df[df["Category"] == "1000 - 1500"]
df_1500 = df[df["Category"] == "> 1500"]

dfs = [pops_df, df_0, df_100, df_200, df_500, df_1000, df_1500]
colors = ["purple", "green", "lime", "yellow", "orange", "orangered", "red"]

world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
ax_0 = world.plot(figsize=(10, 6))
for i, j in enumerate(dfs):
    geometry = [Point(xy) for xy in zip(j["x"], j["y"])]
    gdf = GeoDataFrame(j, geometry=geometry)
    if i == 0:
        ax = gdf.plot(ax=ax_0, marker='o', color = colors[i], markersize=30, legend = True)
    else:
        gdf.plot(ax=ax, marker='o', color = colors[i], markersize=15, legend = True)

plt.legend(["PoP", "< 100", "100 - 200", "200 - 500", "500 - 1000", "1000 - 1500", "> 1500"])
plt.show()