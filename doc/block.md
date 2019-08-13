# Block API

- [Block API](#Block-API)
  - [Block Information](#Block-Information)
  - [Blocks of Date](#Blocks-of-Date)
  - [Recent Blocks](#Recent-Blocks)


## Block Information

**Request URL**
```
GET /block/:height
GET /block/:hash
```

**Request**
```
GET /block/9000
GET /block/14f9d58d8f96d3a685808a8be3e5f2743dd71cb1af54fb8a134b9a1bc8bc20b8
```

**Response**
```json
{
  "hash": "14f9d58d8f96d3a685808a8be3e5f2743dd71cb1af54fb8a134b9a1bc8bc20b8",
  "height": 9000,
  "version": 536870912,
  "prevHash": "186d8797fc3280174c0dec83457c8a1e8c1bbd003baf930efce6f23d6cf2ac5a",
  "nextHash": "69e8f78ded5eb2f53f28b7bcde1a4299a61d9cde89d2a8a6c8ff2793fc777119",
  "merkleRoot": "93ce673230dbdd33c90fceca4a1504a8a40aa8ae51464f6f00848d239f08e0b8",
  "timestamp": 1561809392,
  "bits": "1a0aa152",
  "nonce": 0,
  "hashStateRoot": "ff18f1a8d8e6584f8f2c2e921257fd245668de5fb37c8d0800de675eaf673d21",
  "hashUTXORoot": "9e729950c184acd011471252a0c1a4bc279cd4c1e86d543bead4af6df787b2dd",
  "prevOutStakeHash": "9ed785ab666b13becffa83dc2aecc17a80cb434d4ba9670be455e15e730a2d2d",
  "prevOutStakeN": 1,
  "signature": "3044022027bb84b9e75477f3ca81c2bd12612593aa91daeafdb99feef7bbd2b560fb16ba022049e9af798574c8cfc70cd145d9cb223beff9ebf3576eada1c508e21c4edade46",
  "chainwork": "0000000000000000000000000000000000000000000001130f72ecb5f976a847",
  "flags": "proof-of-stake",
  "interval": 16,
  "size": 926,
  "weight": 3596,
  "transactions": [
    "50c7c324f59729da9b30f72cda43de64ef69fa7b617428c69cd1946931ff40b2",
    "89a16f4ce26db8029a835df02f46e0416fe729eee1da8b95225cb35a30fc78f9"
  ],
  "miner": "FMcbkqP2Yv51dBmzk1P7wGbPoK4Cqcw95C",
  "difficulty": 1578241.9071624815,
  "reward": "500000000",
  "confirmations": 5970
}
```


## Blocks of Date

**Request URL**
```
GET /blocks
```
**Request Params**
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
              <code>date</code>
            </td>
            <td>
              <code>ISO 8601 Date String (optional)</code>
            </td>
            <td>Today</td>
        </tr>
    </tbody>
</table>

**Request**
```
GET /blocks?date=2019-01-01
```

**Response**
```json
[
  {
    "hash": "7c22bfc2192145e1db6d9c1492a0697ef7d23893798c454433fab3bcc2c2b35d",
    "height": 9738,
    "timestamp": 1546387072,
    "interval": 208,
    "size": 1668,
    "transactionCount": 5,
    "miner": "FMcbkqP2Yv51dBmzk1P7wGbPoK4Cqcw95C",
    "reward": "502883776"
  },
  {
    "hash": "27687c6f8a9ad7db5d278db9326f3ac9a0b701a851b29fe81b779f95ff759056",
    "height": 9737,
    "timestamp": 1546386864,
    "interval": 496,
    "size": 3178,
    "transactionCount": 5,
    "miner": "fYHV93kbN9osowPHTWHjeYzgrmZasdatov",
    "reward": "504394122"
  },
  {
    "hash": "37051ffc1e77a552994a6700bc32a778196f2f7165d07b4df020b134bf662021",
    "height": 9736,
    "timestamp": 1546386368,
    "interval": 64,
    "size": 928,
    "transactionCount": 2,
    "miner": "FdB6krR2kgssX7xnx8E9JPrRktfSBRBrEa",
    "reward": "500000000"
  },
  // ... 592 more items ...
   {
    "hash": "4a6f69b82f578c4edceaf03f0015f8ccc1ef613181ec69c64f95cc44e4c6ddc2",
    "height": 9140,
    "timestamp": 1546301264,
    "interval": 512,
    "size": 2008,
    "transactionCount": 6,
    "miner": "FgYB6x5RQBGgGL2R7Qe6WJAsUE4ZkdBj7Z",
    "reward": "522733104"
  }
]
```


## Recent Blocks

**Request URL**
```
GET /recent-blocks
```
**Request Params**
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
              <code>count</code>
            </td>
            <td>
              <code>Number (optional)</code>
            </td>
            <td>10</td>
            <td>Number of Recent Blocks</td>
        </tr>
    </tbody>
</table>

**Request**
```
GET /recent-blocks?count=5
```

**Response**
```json
[
  {
    "hash": "cda36eef9029d120c6f0ba34392954aa2a929643f33a791d7f47332721a7ab86",
    "height": 30981,
    "timestamp": 1562661728,
    "interval": 32,
    "size": 882,
    "transactionCount": 2,
    "miner": "FX8U4uMCaQzoLv6rcBvN4dBk9xYPi8TkcR",
    "reward": "500000000"
  },
  {
    "hash": "ca51ad6bcf5c300f8ffce4847dbe881b54cfac886746f09dc41e9323447f2ca2",
    "height": 30980,
    "timestamp": 1562661696,
    "interval": 112,
    "size": 1151,
    "transactionCount": 3,
    "miner": "FQrm6av1tWtTmvkTpft3FygcmLFcrEWGWk",
    "reward": "500090427"
  },
  {
    "hash": "e7f60b634158ae80347ca84d30388f0b7c48563dcfa9183a4a33c755668636fb",
    "height": 30979,
    "timestamp": 1562661584,
    "interval": 80,
    "size": 1406,
    "transactionCount": 3,
    "miner": "FXDkSQAFEneCaPMC4ML6w8kmcrYxhsz4Qv",
    "reward": "502233609"
  }
  
]
```
