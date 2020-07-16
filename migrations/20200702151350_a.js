
exports.up = function(knex) {
   return knex
    .schema

	.createTable( 'buyers', function( buyersTable ) { 
		buyersTable.engine('InnoDB'); 
		buyersTable.increments();
		buyersTable.string( 'firstname', 30 ).nullable();
		buyersTable.string( 'lastname', 30 ).nullable();
		buyersTable.string( 'email', 30 ).notNullable();   
		buyersTable.string( 'phone_number', 30 ).nullable();   
		buyersTable.string( 'nickname', 30 ).nullable(); 
		buyersTable.enu('gender', ['Male', 'Female', 'Others']).defaultTo('Others');   
		buyersTable.integer( 'location' ).unsigned().nullable(); 
		buyersTable.string( 'image', 100 ).nullable();    
		buyersTable.integer( 'attempt').nullable();   
		buyersTable.string( 'last_login', 30 ).nullable();   
		buyersTable.string('created_at',  50).notNullable();
		buyersTable.string('updated_at',  50).nullable();
		buyersTable.enu('status', ['Active', 'Pending', 'Deleted', 'Banned']).defaultTo('Pending');
		buyersTable.foreign('location').references('id').inTable('cities')
		.onDelete('CASCADE') .onUpdate('CASCADE');
	})

    .createTable( 'sellers', function( sellersTable ) { 
        sellersTable.engine('InnoDB'); 
        sellersTable.increments();
		sellersTable.string( 'firstname', 30 ).nullable();
		sellersTable.string( 'lastname', 30 ).nullable();
		sellersTable.string( 'email', 30 ).notNullable();   
    	sellersTable.string( 'shop_name', 30 ).nullable();      
    	sellersTable.text( 'description' ).nullable();  
        sellersTable.string('phone_number',  50).nullable();
        sellersTable.integer( 'location' ).unsigned().nullable(); 
        sellersTable.string('currency',  50).nullable();
        sellersTable.string('created_at',  50).notNullable();
        sellersTable.string('updated_at',  50).nullable(); 
    	sellersTable.enu('status', ['Active', 'Pending', 'Deleted']).defaultTo('Pending'); 
    	sellersTable.foreign('location').references('id').inTable('cities')
   		.onDelete('CASCADE') .onUpdate('CASCADE');
    }) 

  .createTable( 'logins', function( loginTable ) { 
	    loginTable.engine('InnoDB'); 
	    loginTable.increments();
		loginTable.string( 'email', 30 ).notNullable(); 
		loginTable.string( 'password', 250 ).notNullable(); 
	    loginTable.integer('user_id').unsigned().nullable(); 
	    loginTable.integer('shop_id').unsigned().nullable();  
		loginTable.enu('preferred', ['BUYER', 'SELLER', 'OTHERS']).defaultTo('OTHERS');
	    loginTable.string('updated_at',  50).nullable(); 
		loginTable.enu('status', ['Active', 'Pending', 'Deleted']).defaultTo('Pending');
		loginTable.foreign('user_id').references('id').inTable('buyers')
			.onDelete('CASCADE') .onUpdate('CASCADE');
		loginTable.foreign('shop_id').references('id').inTable('sellers')
			.onDelete('CASCADE') .onUpdate('CASCADE'); 
}) 

    
.createTable( 'products', function( productTable ) { 
		productTable.engine('InnoDB');
		productTable.increments();  
		productTable.integer('cat_id').unsigned().nullable(); 
		productTable.integer('shop_id').unsigned().nullable(); 
		productTable.string( 'product_name', 30 ).nullable();      
		productTable.string( 'available', 30 ).nullable();      
		productTable.string( 'price', 30 ).nullable();      
		productTable.text( 'description' ).nullable();         
		productTable.text( 'tags' ).nullable();         
		productTable.integer( 'location' ).unsigned().nullable();  
		productTable.string( 'main_image', 70 ).nullable(); 
		productTable.string( 'first_image', 70 ).nullable(); 
		productTable.string( 'middle_image', 70 ).nullable(); 
		productTable.string( 'last_image', 70 ).nullable(); 
		productTable.string( 'first_delivery', 50 ).nullable();    
		productTable.string( 'second_delivery', 50 ).nullable();    
		productTable.string( 'third_delivery', 50 ).nullable(); 
		productTable.string( 'within_distance', 30 ).nullable();   
		productTable.string( 'within_charge', 30 ).nullable();     
		productTable.string( 'beyond_distance', 30 ).nullable();    
		productTable.string( 'beyond_charge', 30 ).nullable(); 
		productTable.enu('packed', ['PACKED', 'UNPACKED']).defaultTo('PACKED');
		productTable.enu('status', ['Active', 'Pending', 'Deleted']).defaultTo('Pending');    
		productTable.string('created_at',  50).nullable();
		productTable.string('updated_at',  50).nullable();
		productTable.foreign('cat_id').references('id').inTable('categories')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		productTable.foreign('shop_id').references('id').inTable('sellers')
		.onDelete('CASCADE') .onUpdate('CASCADE');
		productTable.foreign('location').references('id').inTable('cities')
		.onDelete('CASCADE') .onUpdate('CASCADE');
})
};

exports.down = function(knex) {
  
};
