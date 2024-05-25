// Получение цен и базовых криптовалют
module.exports.ALL_DATA = `
WITH max_created_dates AS (
  SELECT
      symbol,
      MAX(createdAt) AS max_created_at
  FROM
      (
          SELECT symbol, createdAt FROM price
          UNION ALL
          SELECT symbol, createdAt FROM info
      ) AS subquery
  GROUP BY
      symbol
)
SELECT
  p.symbol,
  i.baseAsset,
  i.quoteAsset,
  p.price
FROM
  price p
INNER JOIN
  info i ON p.symbol = i.symbol
INNER JOIN
  max_created_dates m ON p.symbol = m.symbol AND p.createdAt = m.max_created_at
WHERE
i.status <> 'BREAK';



`;

//  Получение всех криптовалют

module.exports.ALL_CRYPTO = `
SELECT baseAsset AS unique_values
FROM info
UNION
SELECT quoteAsset
FROM info;
`;
